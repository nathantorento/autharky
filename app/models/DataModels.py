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
    img_url_answer = db.Column(db.String(512), index=True)
    img_url_questions = db.Column(db.String(2048), index=True)
    correct_answer = db.Column(db.Integer, index=True)


class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    password_hash = db.Column(db.String(256), unique=False)
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
