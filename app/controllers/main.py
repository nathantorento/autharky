from flask import Blueprint, request, render_template, abort, redirect, url_for, session, jsonify, Response
import os
from flask_login import current_user, login_user, logout_user
from app import db
from app.models.DataModels import Course, User, Topic, SubTopic
import base64
from ..config import DevelopmentConfig
from hashlib import md5
import time
import io
from werkzeug.datastructures import FileStorage

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
		return redirect(url_for('main.home', user_id=current_user.id, course_id=0))
	messages = "Username or Password is incorrect"
	if request.method == 'POST':
		user = User.query.filter_by(username=request.form['username']).first()

		if user is None or not user.check_password(request.form['password']):
			return redirect(url_for('main.index', messages=messages))
		login_user(user, False)
		return redirect(url_for('main.home', user_id=current_user.id, course_id=0))
	return redirect(url_for('main.index', messages=messages))


@main.route('/home/<int:user_id>&&<int:course_id>')
def home(user_id=0, course_id=0):
	if not current_user.is_authenticated:
		return redirect(url_for('main.index'))

	if user_id is 0 and course_id is 0:
		return render_template('home.html')

	course = Course.query.filter_by(user_id=user_id, id=course_id).first()

	if course is None:
		return render_template('home.html')

	json_data = dict()

	json_data['title'] = course.title
	json_data['course_id'] = course.id
	json_data['owner_id'] = course.user_id
	json_data['topic'] = []

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
			json_topic['subtopic'].append(json_subtopic)
		json_data['topic'].append(json_topic)

	return render_template('home.html', course=json_data)


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

	# return render_template('home.html')
	return {'user_id': current_user.id, 'course_id': course.id}, 200


@main.route('/logout')
def logout():
	logout_user()
	return redirect(url_for('main.index'))


@main.route('/getSubTopic/<int:subtopic_id>', methods=['GET'])
def get_subtopic(subtopic_id):

	if not current_user.is_authenticated:
		return Response(status=500)

	subtopic = SubTopic.query.filter_by(id=subtopic_id).first()

	if subtopic is None:
		return Response(status=500)

	json_subtopic = dict()
	json_subtopic['owner_id'] = subtopic.id_user
	json_subtopic['answer'] = subtopic.img_url_answer
	json_subtopic['questions'] = subtopic.img_url_questions.split(',')
	json_subtopic['correct'] = subtopic.correct_answer
	return json_subtopic, 200


@main.route('/upload', methods=['POST'])
def upload():
	data = request.get_json()
	img_data = data['imgQuestion']
	save_image(img_data)
	return {}, 200


@main.route('/register')
def register():
	u = User(username="123")
	u.set_password("123")
	db.session.add(u)
	db.session.commit()


def save_image(img_bs64):

	extension = img_bs64[img_bs64.find('/') + 1:img_bs64.find(';')]

	filename = md5(str(round(time.time() * 1000)).encode("utf8")).hexdigest() + '.' + extension

	file_path = DevelopmentConfig.UPLOAD_FOLDER + '/' + filename

	# img_bs64 += '=' * (-len(img_bs64) % 4)
	starter = img_bs64.find(',')
	img_bs64 = img_bs64[starter + 1:]
	# img_bs64 = bytes(img_bs64, encoding="ascii")
	file_data = io.BytesIO(base64.b64decode(img_bs64))

	file = FileStorage(file_data)
	file.save(os.path.join(DevelopmentConfig.UPLOAD_FOLDER, filename))


	# with open(file_path, "wb") as fh:
	# 	fh.write(file_data)

	return filename
	# starter = img_bs64.find(',')
	# image_data = img_bs64[starter + 1:]
	# image_data = bytes(image_data, encoding="ascii")

