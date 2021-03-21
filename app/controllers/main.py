from itertools import cycle

from flask import Blueprint, request, render_template, abort, redirect, url_for, session, jsonify, Response
import os
from flask_login import current_user, login_user, logout_user
from app import db
from app.models.DataModels import Course, User, Topic, SubTopic, Question, TestResult, Study
import base64
from ..config import DevelopmentConfig
from hashlib import md5
import time
import io
from werkzeug.datastructures import FileStorage
from google.cloud import storage
from sqlalchemy import asc, desc

import pickle
import os.path
#from googleapiclient.discovery import build
#from google_auth_oauthlib.flow import InstalledAppFlow
#from google.auth.transport.requests import Request

main = Blueprint('main', __name__, template_folder='views')


@main.route('/')
def index():
	if 'messages' in request.args:
		messages = request.args['messages']  # counterpart for url_for()
		return render_template('index.html', message=messages)
	return render_template('index.html')


@main.route('/login', methods=['GET', 'POST'])
def login():
	if current_user.is_authenticated:
		user_role = User.query.filter_by(id=current_user.id).first().userrole
		return redirect(url_for('main.home', user_id=current_user.id,  user_role=user_role))
	messages = "Username or Password is incorrect"
	if request.method == 'POST':
		user = User.query.filter_by(username=request.form['username']).first()
		if user is None or not user.check_password(request.form['password']):
			return redirect(url_for('main.index', messages=messages))
		login_user(user, False)
		user_role = User.query.filter_by(id=current_user.id).first().userrole
		return redirect(url_for('main.home', user_id=current_user.id, user_role=user_role))
	return redirect(url_for('main.index', messages=messages))


@main.route('/home/<int:user_id>&&<string:user_role>')
def home(user_id=0, user_role="student"):
	if not current_user.is_authenticated:
		return redirect(url_for('main.index'))
	
	db_courses = Course.query.all()
	courses = []
	for course in db_courses:
		role = "student"
		if course.user_id == current_user.id:
			role = "instructor"
		courses.append({"title":course.title,"role":role,"id":course.id })
	
	return render_template('home.html',courses=courses,user_role=user_role,user_id=user_id)

@main.route('/course/<int:user_id>&&<string:course>&&<string:user_role>')
def course(user_id=0,course="",user_role="student"):
	if not current_user.is_authenticated:
		return redirect(url_for('main.index'))
	
	course = Course.query.filter_by(title=course).first()
	
	json_data = dict()

	json_data['title'] = course.title
	json_data['course_id'] = course.id
	json_data['owner_id'] = course.user_id
	json_data['topic'] = []
	if course.user_id == user_id:
		json_data['role'] = "instructor"
	else:
		json_data['role'] = "student"
	topic_list = Topic.query.filter_by(id_course=course.id).all()

	for topic in topic_list:
		json_topic = dict()
		json_topic['title'] = topic.title
		json_topic['subtopic'] = []
		subtopic_list = SubTopic.query.filter_by(id_topic=topic.id).all()
		for subtopic in subtopic_list:
			json_subtopic = dict()
			json_subtopic['course_id'] = course.id
			json_subtopic['owner_id'] = course.user_id
			json_subtopic['topic_id'] = topic.id
			json_subtopic['title'] = subtopic.title
			json_subtopic['subtopic_id'] = subtopic.id
			test_result = TestResult.query.filter_by(id_subtopic=subtopic.id).filter_by(id_user=user_id).first()
			if test_result is None:
				json_subtopic['test_result'] = -1
			else:
				is_correct = test_result.is_correct
				if len(is_correct.split('0')) == 1:
					json_subtopic['test_result'] = 1
				else:
					json_subtopic['test_result'] = 0
			json_topic['subtopic'].append(json_subtopic)
		json_data['topic'].append(json_topic)

	return render_template('course.html',course=json_data,user_id=user_id,user_role=user_role)

@main.route('/create')
def create():
	if not current_user.is_authenticated:
		return redirect(url_for('main.index'))
	return render_template('create.html')


@main.route('/create_course', methods=['GET', 'POST'])
def create_course():
	if not current_user.is_authenticated:
		return redirect(url_for('main.index'))

	jsonData = request.get_json()
	user = User.query.filter_by(id=current_user.id).first()
	course = Course(title=jsonData['title'], user=user)
	db.session.add(course)

	for json_topic in jsonData['topic']:
		topic = Topic(title=json_topic['title'], course=course)
		db.session.add(topic)
		for json_subtopic in json_topic['subtopic']:
			subtopic = SubTopic(title=json_subtopic['title'], course=course, topic=topic, user=user)
			db.session.add(subtopic)
	
	db.session.commit()
	'''
	SCOPES = ['https://www.googleapis.com/auth/documents.readonly']
	creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
	if os.path.exists('token.pickle'):
		with open('token.pickle', 'rb') as token:
			creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
	if not creds or not creds.valid:
		if creds and creds.expired and creds.refresh_token:
			creds.refresh(Request())
		else:
			flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
			creds = flow.run_local_server(port = 0)
        # Save the credentials for the next run
		with open('token.pickle', 'wb') as token:
			pickle.dump(creds, token)
	service = build('docs', 'v1', credentials=creds)


	title = "Capstone_"+jsonData['title']
	body = {
		'title': title
	}
	doc = service.documents().create(body=body).execute()
	print('Created document with title: {0}'.format(doc.get('title')))
	# return render_template('home.html')
	'''
	return {'user_id': current_user.id, 'course_id': course.id, 'course' : course.title}, 200

@main.route('/create_question', methods=['GET', 'POST'])
def create_question():
	if not current_user.is_authenticated:
		return redirect(url_for('main.index'))

	jsonData = request.get_json()

	subtopic = SubTopic.query.filter_by(id=jsonData['subtopic_id']).first()
	question = Question(question_type=jsonData['question_type'],question=jsonData['question'],id_course=subtopic.id_course,id_topic=subtopic.id_topic,id_subtopic=jsonData['subtopic_id'],id_user=subtopic.id_user,answer1=jsonData['answer1'],answer2=jsonData['answer2'],answer3=jsonData['answer3'],answer4=jsonData['answer4'],question_number=jsonData['number'],correct_answer=jsonData['correct'])
	db.session.add(question)
	db.session.commit()

	# return render_template('home.html')
	return {'user_id': current_user.id, 'subtopic_id': subtopic.id, 'question_id' : question.id, 'question_number' : question.question_number}, 200

@main.route('/finish_test', methods=['GET', 'POST'])
def finish_test():
	if not current_user.is_authenticated:
		return redirect(url_for('main.index'))

	jsonData = request.get_json()
	answers = jsonData['answers']
	questions = Question.query.filter_by(id_subtopic=jsonData['subtopic_id']).order_by(asc(Question.question_number)).all()
	if len(answers) != len(questions):
		print("lenth do not match")
		return
	subtopic = SubTopic.query.filter_by(id=jsonData['subtopic_id']).first()
	if subtopic is None:
		print("There is no matching subtopic")
		return
	is_correct = []
	correct_answers = []
	for i in range(len(answers)):
		if answers[i] == questions[i].correct_answer:
			is_correct.append(1)
		else:
			is_correct.append(0)
		correct_answers.append(questions[i].correct_answer)
	result = TestResult(id_user=jsonData['user_id'],id_subtopic=jsonData['subtopic_id'],id_course=subtopic.id_course,id_topic=subtopic.id_topic,question_count=len(answers),answers=','.join([str(elem) for elem in answers]) ,correct_answers=','.join([str(elem) for elem in correct_answers]) ,is_correct=','.join([str(elem) for elem in is_correct]) )
	db.session.add(result)
	db.session.commit()
	
	# return render_template('home.html')
	return {'user_id': current_user.id, 'subtopic_id': jsonData['subtopic_id'], 'question_count' : len(answers), 'answers' : answers, 'correct_answers': correct_answers, 'is_correct': is_correct}, 200


@main.route('/logout')
def logout():
	logout_user()
	return redirect(url_for('main.index'))


@main.route('/get_subtopic', methods=['GET', 'POST'])
def get_subtopic():

	if not current_user.is_authenticated:
		return Response(status=500)

	param = request.get_json()
	subtopic_id = param['id']
	subtopic = SubTopic.query.filter_by(id=subtopic_id).first()

	if subtopic is None:
		return Response(status=500)

	json_subtopic = dict()
	json_subtopic['owner_id'] = subtopic.id_user
	json_subtopic['question'] = subtopic.img_url_question
	json_subtopic['answers'] = []
	json_subtopic['answers'] = subtopic.img_url_answers.split(' ')
	json_subtopic['correct'] = subtopic.correct_answer
	return json_subtopic, 200


@main.route('/upload', methods=['POST'])
def upload():
	data = request.get_json()
	img_data = data['imgQuestion']

	subtopic = SubTopic.query.filter_by(id=data['subtopic_id']).first()

	if subtopic is None:
		return {}, 400

	file_name = save_image(img_data)
	subtopic.img_url_question = file_name
	subtopic.img_url_answers = ""
	subtopic.correct_answer = data['correct_answer']

	for img_ans in data['imgAnswers']:
		file_name = save_image(img_ans)
		if file_name is None:
			continue
		subtopic.img_url_answers += file_name + " "

	db.session.commit()
	return {}, 200


@main.route('/register', methods=["GET", "POST"])
def register():
	if request.method == "POST":
		username = request.form['user']
		mail = request.form['mail']
		passw = request.form['passw']
		repeat = request.form['repeat']
		userrole = request.form['userrole']

		registered_user = User.query.filter_by(username=username).first()
		
		if registered_user is not None:
			return render_template("register.html", message="There is already a registered user who has the same name.")
		
		registered_email = User.query.filter_by(email=mail).first()

		if registered_email is not None:
			return render_template("register.html", message="There is already a registered user who has the same email address.")

		user = User(username=username, email=mail, userrole=userrole)
		user.set_password(passw)

		db.session.add(user)
		db.session.commit()

		return redirect(url_for("main.index"))
	return render_template("register.html")


def save_image(img_bs64):
	if not img_bs64 or img_bs64 is None:
		return None

	extension = img_bs64[img_bs64.find('/') + 1:img_bs64.find(';')]

	filename = md5(str(round(time.time() * 1000)).encode("utf8")).hexdigest() + '.' + extension

	gcs = storage.Client()

	CLOUD_STORAGE_BUCKET = os.environ.get('CLOUD_STORAGE_BUCKET' '')

	bucket = gcs.get_bucket(CLOUD_STORAGE_BUCKET)

	blob = bucket.blob(filename)

	# file_path = DevelopmentConfig.UPLOAD_FOLDER + '/' + filename

	starter = img_bs64.find(',')
	img_bs64 = img_bs64[starter + 1:]
	file_data = io.BytesIO(base64.b64decode(img_bs64))

	# blob.upload_from_string(
	# 	file_data,
	# 	content_type=uploaded_file.content_type
	# )

	blob.upload_from_string(
		base64.b64decode(img_bs64)
	)

	# file = FileStorage(file_data)
	# file.save(os.path.join(DevelopmentConfig.UPLOAD_FOLDER, filename))

	# return filename
	return blob.public_url


@main.route('/getsubtopicinfo', methods=["GET", "POST"])
def getsubtopicinfo():
	param = request.get_json()
	subtopic_id = param['subtopic_id']
	questions = Question.query.filter_by(id_subtopic=subtopic_id).order_by(asc(Question.question_number)).all()

	subtopic_info = []
	for i in questions:
		subtopic_info.append({"question_type":i.question_type,"question":i.question,"answer1":i.answer1,"answer2":i.answer2,"answer3":i.answer3,"answer4":i.answer4,"question_number":i.question_number,"correct_answer":i.correct_answer})
	return {"question":subtopic_info,"count":len(questions)}, 200


@main.route('/get_testinfo', methods=["GET", "POST"])
def get_testinfo():
	param = request.get_json()
	subtopic_id = param['subtopic_id']
	user_id = param['user_id']

	testResult = TestResult.query.filter_by(id_user=user_id,id_subtopic=subtopic_id,show=1).all()

	if len(testResult) == 0:
		return {"tested": False}, 200
	
	testResult = testResult[0]
	return {"tested": True,'user_id': user_id, 'subtopic_id': subtopic_id, 'question_count' : testResult.question_count, 'answers' : testResult.answers.split(','), 'correct_answers': testResult.correct_answers.split(','), 'is_correct': testResult.is_correct.split(',')}, 200

@main.route('/joinCourse', methods=["GET", "POST"])
def joinCourse():
	param = request.get_json()
	course = param['course']
	course = Course.query.filter_by(title=course).all()
	if len(course) > 0:
		return {"exist" : True},200
	else:
		return {"exist" : False}, 200

@main.route('/delCourse', methods=["GET", "POST"])
def delCourse():
	param = request.get_json()
	user_id = param['user_id']
	course_id = param['course_id']
	testResult = TestResult.query.filter_by(id_user=user_id,id_course=course_id).delete()
	db.session.commit()
	question = Question.query.filter_by(id_user=user_id,id_course=course_id).delete()
	db.session.commit()
	subtopic = SubTopic.query.filter_by(id_user=user_id,id_course=course_id).delete()
	db.session.commit()
	topic = Topic.query.filter_by(id_course=course_id).delete()
	db.session.commit()
	course = Course.query.filter_by(user_id=user_id,id=course_id).delete()
	db.session.commit()
	return {}, 200

@main.route('/set_study', methods=['GET', 'POST'])
def set_study():

	jsonData = request.get_json()

	study = Study.query.filter_by(user_id=jsonData['user_id'],subtopic_id=jsonData['subtopic_id']).first()
	if study is not None:
		study.study = jsonData['study']
		db.session.commit()
	else:
		study = Study(user_id=jsonData['user_id'],subtopic_id=jsonData['subtopic_id'],study=jsonData['study'])
		db.session.add(study)
		db.session.commit()
	# return render_template('home.html')
	return {'user_id': jsonData['user_id'], 'subtopic_id': jsonData['subtopic_id'], 'study': jsonData['study']}, 200

@main.route('/get_study', methods=['GET', 'POST'])
def get_study():

	jsonData = request.get_json()

	study = Study.query.filter_by(user_id=jsonData['user_id'],subtopic_id=jsonData['subtopic_id']).first()
	if study is None:
		return {'user_id': jsonData['user_id'], 'subtopic_id': jsonData['subtopic_id'], 'study': ""}, 200
	else:
		return {'user_id': jsonData['user_id'], 'subtopic_id': jsonData['subtopic_id'], 'study': study.study}, 200
	# return render_template('home.html')
	return {'user_id': jsonData['user_id'], 'subtopic_id': jsonData['subtopic_id'], 'study': jsonData['study']}, 200
