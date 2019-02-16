
document.addEventListener('DOMContentLoaded', function() {

    if (!localStorage.getItem('channels')) {
        var channels = [];
        localStorage.setItem('channels', JSON.stringify(channels));
    }

    var ch = JSON.parse(localStorage.getItem('channels'));

    // Loop through channels list in localStorage to display
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

    var selectedChannel = localStorage.getItem('selectedChannel');
    document.querySelectorAll('.channel').forEach(function(li) {
        console.log('li here', li)
        li.onclick = function() {

            var messagesNode = document.getElementById('#messages');
            messagesNode.innerHTML = '';

            console.log('clicked li')
            let channel = li.innerHTML;
            localStorage.setItem('channel', channel);
            console.log(channel);
            if (!localStorage.getItem(selectedChannel)) {
                var newChannel = []
                localStorage.setItem(selectedChannel, JSON.stringify(newChannel));
            }

            const ml = JSON.parse(localStorage.getItem(selectedChannel));

            // Loop through messages for clicked channel in localStorage to display chat history
            var i = 0;
            for (i = 0; i < ml.length; i++) {
                const li = document.createElement('li');
                li.innerHTML = "<b>" + ml[i]['user'] + " </b>" + "<span style='font-weight: 100; font-size: 12px'>"
                                + ml[i]['time'] + " </span><br />" + ml[i]['message'];

                // Add new message to list
                document.querySelector('#messages').append(li);
            }
        };
    });

    // By default, submit button is disabled
    document.querySelector('#message-submit').disabled = true;

    // Connect to websocket
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

        var d = new Date();
        var hr = d.getHours();
        var min = d.getMinutes();
        var sec = d.getSeconds();
        var now = hr + ':' + min + ':' + sec;

        var user = localStorage.getItem('displayName');

        document.querySelector('#new-message').onsubmit = function() {

            var myMessage = document.querySelector('#message').value;

            socket.emit('submit message', {'user': user, 'time': now, 'message': myMessage});

            // Stop form from submitting
            return false;
        };
    });

    socket.on('announce message', message => {

        console.log('my message is ' + message['user'] + ' ' + message['time'] + ' ' + message['message']);

        // Create new item for list
        const li = document.createElement('li');
        li.innerHTML = "<b>" + message['user'] + " </b>" + "<span style='font-weight: 100; font-size: 12px'>" +
                        message['time'] + " </span><br />" + message['message'];

        // Add new message to list
        document.querySelector('#messages').append(li);

        let ml = JSON.parse(localStorage.getItem(selectedChannel));
        ml.push({'user': message['user'], 'time': message['time'], 'message': message['message']});
        localStorage.setItem(selectedChannel, JSON.stringify(ml));

        // Clear input field and disable submit button again
        document.querySelector('#message').value = '';
        document.querySelector('#message-submit').disabled = true;
    });
})