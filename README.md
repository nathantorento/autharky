# Autharky

## Abstract
From the words author and “autarky” – an economic system of self-sufficiency – comes Autharky, an accessible online platform where you are the author of your own studying journey.

If a student wants to consolidate their study resources online, the current platforms are either services that have to be paid for full access, require membership through an existing academic institution, require users to be only either a student or instructor, or are too inflexible in the features they have added.

Autharky is a web app that, for every course or subject they are taking, allows anyone to centralize all their studying resources into one group that I call a “course”, which can be divided by multiple “topics'' that each have their own “subtopic”. The web app’s main features are that it allows a user to create a secure account in one step, see all existing public courses, quickly create or join a course, make that course public or private. For each course, information is separate by subtopic. Those who’ve joined a course can access a subtopic where they can take notes on a private document but also collaborate on a shared document accessible to everyone who’s joined. In both documents, they can type information, embed pictures/videos/links, and style text collaboratively. In every subtopic, the course creator can create diagnostic questions that others can answer to allow them to identify where they need to prioritize their studying.

## App structure

This entire web app was built on the Flask microweb framework for web design using the programming language Python, using SQL for its database management, and currently deployed through the Google App Engine (though I may change the server because Google’s is too expensive). 

It was designed under the popular Model-View-Controller MVC application framework for app and web development (Doherty, 2020). This subdivides the app structure and code into three main components.
model: storage and management of data
view: the graphical user interface that the users see and interact with
controller: facilitates inputs from the view to change or update data in the model


## High-level code overview

This is a high-level overview of what happens when Flask runs the main python file runServer.py
- inside the app folder, there are 4 main folders: controllers, models, static, and views
- the program goes into the main app folder and runs  the __init__.py file
- the __init__.py file sets up the database with the SQLAlchemy, the LoginManager, and JSGlue modules, then officially “creates” the app; these are the main processes occurring during the app’s creation
  - the program establishes the views folder, containing all the main .html files, as the main source of the structure for the pages that users will ultimately interact with
  - every .html file is coded to source its design from the css, images, fonts, and javascript folders in the static folder using the JSGlue model
  - the LoginManager module is then run to allow for registration and login
  - then, the database for the user information, courses, and uploaded material is set up by calling config.py
- it then initiates the “blueprints” 
  - that includes configuring the main.py under controllers responsible for handling all the Flask redirects and uploading functions
  - in the main.py, any input from the user’s end is accordingly reflected in the appropriate datatables found in models 
