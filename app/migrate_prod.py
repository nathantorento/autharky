DB_MIGRATION_URI = "mysql+mysqldb://user:password@instance_id/db_name?ssl_key=path/client-key.pem&ssl_cert=path/client-cert.pem&&ssl_ca=path/server-ca.pem"
from flask import Flask
# from flask.ext.sqlalchemy import SQLAlchemy
from flask_sqlalchemy import SQLAlchemy
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from .models import *   # not needed if migration file is already generated

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DB_MIGRATION_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

manager = Manager(app)
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()