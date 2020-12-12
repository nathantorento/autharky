#!/usr/bin/python

from app import create_app

# app=create_app()

# app.run(host="0.0.0.0")
create_app().run(debug=True)
