
document.addEventListener('DOMContentLoaded', function() {

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

    if (!localStorage.getItem('selectedChannel')) {
        let channel = '';
        localStorage.setItem('selectedChannel', channel);
    }

    if (!localStorage.getItem('messages')) {
        let messages = [];
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    var messagesList = document.getElementById('messages');
    if (messagesList.hasChildNodes()){
        messagesList.removeChild(messagesList.childNodes[0]);
    }

    // Loop through messages for clicked channel in localStorage to display chat history
    var ml = JSON.parse(localStorage.getItem('messages'));
    console.log(ml);

    var i = 0;
    for (i = 0; i < ml.length; i++) {
        if (ml[i]['channel'] == localStorage.getItem('selectedChannel')) {
            console.log(ml[i]);
            const li = document.createElement('li');
            li.innerHTML = "<b>" + ml[i]['user'] + " </b>" + "<span style='font-weight: 100; font-size: 12px'>"
                            + ml[i]['time'] + " </span><br />" + ml[i]['message'];

            // Add new message to list
            document.querySelector('#messages').append(li);
        }
    }


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
                    console.log(ml[i]);
                    const li = document.createElement('li');
                    li.innerHTML = "<b>" + ml[i]['user'] + " </b>" + "<span style='font-weight: 100; font-size: 12px'>"
                                    + ml[i]['time'] + " </span><br />" + ml[i]['message'];

                    // Add new message to list
                    document.querySelector('#messages').append(li);
                }
            }
        };
    });

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

        document.querySelector('#new-message').onsubmit = function() {

            let d = new Date();
            let hr = d.getHours();
            let min = d.getMinutes();
            let sec = d.getSeconds();
            let now = hr + ':' + min + ':' + sec;

            let user = localStorage.getItem('displayName');

            let myMessage = document.querySelector('#message').value;
            let selectedChannel = localStorage.getItem('selectedChannel');
            console.log(myMessage);

            if (selectedChannel == '' || user == '' || now == '' || myMessage == ''){
                return false;
            }

            socket.emit('submit message', {'channel': selectedChannel, 'user': user, 'time': now, 'message': myMessage});

            // Stop form from submitting
            return false;
        };
    });

    socket.on('announce message', message => {

        console.log('my message is ' + message['channel'] + ' ' + message['user'] + ' ' + message['time'] + ' ' + message['message']);

        // Create new item for list
        const li = document.createElement('li');
        li.innerHTML = "<b>" + message['user'] + " </b>" + "<span style='font-weight: 100; font-size: 12px'>" +
                        message['time'] + " </span><br />" + message['message'];

        // Add new message to list
        document.querySelector('#messages').append(li);

        let ml = JSON.parse(localStorage.getItem("messages"));
        ml.push({'channel': message['channel'], 'user': message['user'], 'time': message['time'], 'message': message['message']});
        localStorage.setItem('messages', JSON.stringify(ml));

        // Clear input field and disable submit button again
        document.querySelector('#message').value = '';
        document.querySelector('#message-submit').disabled = true;
    });
})