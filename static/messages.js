// js file for message.html
function removeDisplayMessages() {
    // Remove messages for previous selected channel
    var messagesList = document.getElementById('messages');
    messagesList.innerHTML = '';
}

function displayMessages() {

    // Loop through messages for clicked channel in localStorage to display chat history
    var ml = JSON.parse(localStorage.getItem('messages'));

    var i = 0;
    for (i = 0; i < ml.length; i++) {
        if (ml[i]['channel'] == localStorage.getItem('selectedChannel')) {
            const li = document.createElement('li');
            li.innerHTML = "<b>" + ml[i]['user'] + " </b>" + "<span style='font-weight: 100; font-size: 12px'>"
                            + ml[i]['time'] + " </span><br />" + ml[i]['message'];

            // Add new message to list
            document.querySelector('#messages').append(li);
        }
    }
}

function limitMessageNumber(channel) {

    var ml = JSON.parse(localStorage.getItem('messages'));

    // n represents the number of messages for the selected channel
    // f is the number of first message for the selected channel
    // k is the number of the messages
    var n = 0;
    var f;
    for (var k = 0; k < ml.length; k++) {
        if (ml[k]['channel'] == channel) {
            n++;
            if (n == 1) {
                f = k;
            }
        }
        if (n > 99) {
            ml.splice(f, 1);
        }
    }

    localStorage.setItem('messages', JSON.stringify(ml));
}

function addEmojiToMessage(emojiCode) {
    var messageBox = document.getElementById('message');
    var messageContent = messageBox.value;
    var newMessageContent = messageContent + '' + emojiCode;
    messageBox.value = newMessageContent;
}

document.addEventListener('DOMContentLoaded', function() {

    // Ensure local storage has channels list
    if (!localStorage.getItem('channels')) {
        let channels = [];
        localStorage.setItem('channels', JSON.stringify(channels));
    }

    // Loop through channels list in localStorage to display
    var ch = JSON.parse(localStorage.getItem('channels'));

    var j;
    for (j = 0; j < ch.length; j++) {
        const li = document.createElement('li');
        li.innerHTML = ch[j]['channel'];
        li.className = 'channel';

        // Add new message to list
        document.querySelector('#channels').append(li);
    }

    // Ensure local storage has selected channel
    if (!localStorage.getItem('selectedChannel')) {
        let channel = '';
        localStorage.setItem('selectedChannel', channel);
    }

    // Ensure local storage has messages list
    if (!localStorage.getItem('messages')) {
        let messages = [];
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    // Clear up messages for previously selected channel
    removeDisplayMessages();

    // Display messages for currently selected channel
    displayMessages();

    // Display messages when a channel is clicked
    document.querySelectorAll('.channel').forEach(function(li) {
        li.onclick = function() {

            var messagesList = document.getElementById('messages');
            messagesList.innerHTML = '';

            let selectedChannel = li.innerHTML;
            localStorage.setItem('selectedChannel', selectedChannel);

            let ml = JSON.parse(localStorage.getItem('messages'));

            let i = 0;
            for (i = 0; i < ml.length; i++) {
                if (ml[i]['channel'] == localStorage.getItem('selectedChannel')) {
                    const li = document.createElement('li');
                    li.innerHTML = "<b>" + ml[i]['user'] + " </b>" + "<span style='font-weight: 100; font-size: 12px'>"
                                    + ml[i]['time'] + " </span><br />" + ml[i]['message'];

                    // Add new message to list
                    document.querySelector('#messages').append(li);
                }
            }
        };
    });

    // Emoji listener
    document.querySelectorAll('.emoji-button').forEach(function(span) {
        span.onclick = function(emojiSpan) {
            var emojiCode = emojiSpan.target.innerText;
            addEmojiToMessage(emojiCode);
        };
    })

    // By default, submit button is disabled
    document.querySelector('#message-submit').disabled = true;

    // Connect to web socket
    var socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port);

    socket.on('connect', () => {

        console.log("socket connected")

        // Enable button only if there is text in the input
        document.querySelector('#message').onkeyup = () => {
            if (document.querySelector('#message').value.length > 0) {
                document.querySelector('#message-submit').disabled = false;
            }
            else {
                document.querySelector('#message-submit').disabled = true;
            }
        }

        // Emit message to  when submitted
        document.querySelector('#new-message').onsubmit = function() {

            var d = new Date();
            var hr = d.getHours();
            var min = d.getMinutes();
            var sec = d.getSeconds();
            var now = hr + ':' + min + ':' + sec;

            var user = localStorage.getItem('displayName');

            var myMessage = document.querySelector('#message').value;
            var selectedChannel = localStorage.getItem('selectedChannel');

            if (!selectedChannel || !user || !now || !myMessage){
                return false;
            }

            socket.emit('submit message', {'channel': selectedChannel, 'user': user, 'time': now, 'message': myMessage});

            $('html, body').animate({scrollTop: $("#myDiv").offset().top}, 2000);

            // Stop form from submitting
            return false;
        };
    });

    socket.on('announce message', message => {

        let ml = JSON.parse(localStorage.getItem("messages"));
        ml.push({'channel': message['channel'], 'user': message['user'], 'time': message['time'], 'message': message['message']});
        localStorage.setItem('messages', JSON.stringify(ml));

        // Delete earliest message if over 100 for this channel
        limitMessageNumber(message['channel']);

        removeDisplayMessages();
        displayMessages();

        // Clear input field and disable submit button again
        document.querySelector('#message').value = '';
        document.querySelector('#message-submit').disabled = true;
    });
})