#!/usr/bin/env python
import os
"""
Flask configuration objects.
"""

def gen_connection_string():

    if not os.environ.get('CLOUD_APP', '').startswith('AppEngine'):
        return 'mysql+pymysql://root@127.0.0.1:3306/capstone_db'
    else:
        conn_name = os.environ.get('CLOUD_SQL_CONNECTION_NAME' '')
        sql_user = os.environ.get('CLOUDSQL_USER', 'root')
        sql_pass = os.environ.get('CLOUDSQL_PASSWORD', '')
        conn_template = 'mysql+pymysql://%s:%s@/capstone_db?unix_socket=/cloudsql/%s'
        return conn_template % (sql_user, sql_pass, conn_name)


class DevelopmentConfig(object):
    DEBUG = True
    TESTING = True
    API_MODE = False
    SECRET_KEY = "capstone_app"
    LIVE_SQLALCHEMY_DATABASE_URI = gen_connection_string()
    SQLALCHEMY_DATABASE_URI = LIVE_SQLALCHEMY_DATABASE_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    APP_ROOT = os.path.dirname(os.path.abspath(__file__))
    UPLOAD_FOLDER = os.path.join(APP_ROOT, 'static/images')
