import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
io = SocketIO(app)


@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("login.html")


@app.route("/create_channel", methods=["GET", "POST"])
def create_channel():
    return render_template("create_channel.html")


@app.route("/channels", methods=["GET", "POST"])
def channels():
    return render_template("messages.html")


@app.route("/channels/<string:my_channel>", methods=["GET", "POST"])
def display_channel(my_channel):
    return render_template("messages.html", selectedChannel=my_channel)


@io.on("submit message")
def handle_message(message):
    user = message['user']
    time = message['time']
    myMessage = message['message']
    print("py: " + myMessage)
    emit("announce message", {'user': user, 'time': time, 'message': myMessage}, broadcast=True)
