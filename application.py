import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
io = SocketIO(app)


@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")


@app.route("/messages", methods=["GET", "POST"])
def messages():
    return render_template("messages.html")


@io.on("submit message")
def handle_message(message):
    user = message['user']
    time = message['time']
    myMessage = message['message']
    print("py: " + myMessage)
    emit("announce message", {'user': user, 'time': time, 'message': myMessage}, broadcast=True)
