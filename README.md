# Project 2 for CS50 Web Programming with Python and JavaScript online course

## What does this project do?
This is a simple chatting web app. You can fill in a displayName and login. You can create new chatting channels. Once you click on  
on one channel on the left side, you can send messages to that channel. Existing messages for that channel will be displayed as well.
At maximum the latest 100 messages can be stored for each channel. 

## What files are included in this repo?
- `application.py` - flask application file
- `templates/login.html` - html file for login page
- `templates/create_channel.html` - html file for creating new channels
- `templates/messages.html` - html file for displaying channels, displaying messages, sending messages and so on
- `static/login.js` - js file for login.html
- `static/create_channel.js` - js file for create_channel.html
- `static/messages.js` - js file for messages.html
- `static/styles.css` - stylesheet
- `requirements.txt` - stores necessary Python packages to be installed
- `.gitignore` - stores file names that should be ignored by git

## How to run this project?
- Clone this repo from git to local pc
- In a terminal window, navigate into your project2 directory
- Run `pip3 install -r requirements.txt` in your terminal window to install necessary packages
- Set the environment variable FLASK_APP to be application.py. On a Mac or on Linux, the command to do this is `export FLASK_APP=application.py`. 
On Windows, the command is instead `set FLASK_APP=application.py`
- Run `flask run` to start up your Flask application
- Open `http://127.0.0.1:5000` in a web browser, fill in a display name and submit
- In the main page, click `New Channel` and go to a new page to create channels, then go back to messages page
- Click on channels on the leftside bar, you can send message to that specific channel

## Personal touch
In the main page, when sending new messages, emojis above the message input window can be clicked and added. 




