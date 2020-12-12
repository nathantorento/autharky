# Nathan Torento's Capstone

The product is an online learning website that makes it simple and quick for instructors and/or learners to migrate existing curriculums into an online course that implements adaptive learning.

## Local testing
os: macOS Catalina 10.15.4
Python:  3.8

```
# Install virtualenv package
pip install virtualenv

# Create a virtualenv; I chose the name cpenv
python -m venv cpenv

# Activate the virtual environment (make sure you're in the right directory)
source cpenv/bin/activate

# Install flask
pip install flask

# Download XAMPP here – https://www.apachefriends.org/download.html

# OPEN MANAGER-OSX
# GO to Manage Servers
# Press Start All

# Start the mySQL server
sudo /Applications/XAMPP/xamppfiles/bin/mysql.server start
# enter password

#---ONE TIME ONLY---
# After XAMPP is run, go to localhost/phpmyadmin 
# to create a new database called capstone_db on the left side of the screen
# ignore only fill in the “Database name”; no need to worry about everything else

flask db init
flask db migrate -m “subtopic table”
flask db upgrade
#---    END     ---

# While on the virtual environment
# Go to the directory of this project
cd ~/GitHub/capstone 

export FLASK_APP=runServer.py
export FLASK_ENV=development

flask run
```

## Deploying app online
```
# Obtain a server; I got mine at 
# https://console.cloud.google.com/

# Install Google Cloud SDK; I followed these instructions below
# https://cloud.google.com/sdk/docs/install

# Obtain a domain; I got mine through 
# Google Domains at domains.google.com

# Under DNS, custom resource records, set up 

# Follow the official instructions to deploy
#https://cloud.google.com/appengine/docs/flexible/python/quickstart

cd ~capstone
gcloud app deploy

```
