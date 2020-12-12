from flask import Blueprint, request, render_template, abort, redirect, url_for
home = Blueprint('home', __name__, template_folder='views')

@home.route('/')
def index():
	return render_template('home.html')