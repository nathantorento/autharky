from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app import login
from app import db


class Course(db.Model):
    __tablename__ = 'course'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    topic = db.relationship('Topic', backref='course', lazy='dynamic')
    subtopic = db.relationship('SubTopic', backref='course', lazy='dynamic')


class Topic(db.Model):
    __tablename__ = 'topic'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), index=True)
    id_course = db.Column(db.Integer, db.ForeignKey('course.id'))
    subtopic = db.relationship('SubTopic', backref='topic', lazy='dynamic')


class SubTopic(db.Model):
    __tablename__ = 'subtopic'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256), index=True)
    id_course = db.Column(db.Integer, db.ForeignKey('course.id'))
    id_topic = db.Column(db.Integer, db.ForeignKey('topic.id'))
    id_user = db.Column(db.Integer, db.ForeignKey('user.id'))
    question_count = db.Column(db.Integer,default=0)

class Question(db.Model):
    __tablename__ = 'question'
    id = db.Column(db.Integer, primary_key=True)
    question_type = db.Column(db.Integer)
    question = db.Column(db.String(256), index=True)
    id_course = db.Column(db.Integer, db.ForeignKey('course.id'))
    id_topic = db.Column(db.Integer, db.ForeignKey('topic.id'))
    id_subtopic = db.Column(db.Integer, db.ForeignKey('subtopic.id'))
    id_user = db.Column(db.Integer, db.ForeignKey('user.id'))
    answer1 = db.Column(db.Text())
    answer2 = db.Column(db.Text())
    answer3 = db.Column(db.Text())
    answer4 = db.Column(db.Text())
    question_number = db.Column(db.Integer,default=1)
    correct_answer = db.Column(db.Integer)

class TestResult(db.Model):
    __tablename__ = 'test_result'
    id = db.Column(db.Integer, primary_key=True)
    id_course = db.Column(db.Integer, db.ForeignKey('course.id'))
    id_topic = db.Column(db.Integer, db.ForeignKey('topic.id'))
    id_subtopic = db.Column(db.Integer, db.ForeignKey('subtopic.id'))
    id_user = db.Column(db.Integer, db.ForeignKey('user.id'))
    question_count = db.Column(db.Integer)
    answers = db.Column(db.String(256))
    correct_answers = db.Column(db.String(256))
    is_correct = db.Column(db.String(256))
    show = db.Column(db.Integer,default=1)

class Study(db.Model):
    __tablename__ = 'user_texts'
    id = db.Column(db.Integer, primary_key=True)
    subtopic_id = db.Column(db.Integer, db.ForeignKey('subtopic.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    study = db.Column(db.Text())

class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    password_hash = db.Column(db.String(256), unique=False)
    userrole = db.Column(db.String(256), unique=False)
    email = db.Column(db.String(256), unique=True)
    course = db.relationship('Course', backref='user', lazy='dynamic')
    subtopic = db.relationship('SubTopic', backref='user', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # def is_authenticated(self):
    # 	return True

    # def is_active(self):
    # 	return True

    # def is_anonymous(self):
    # 	return False

    # def get_id(self):
    # 	return unicode(self.id)

    def __repr__(self):
        return '<User %r>' % (self.username)


@login.user_loader
def load_user(id):
    return User.query.get(int(id))
