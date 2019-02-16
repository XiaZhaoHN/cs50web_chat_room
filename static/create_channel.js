// Unique ID generator: https://codepen.io/gabrieleromanato/pen/Jgoab
function IDGenerator() {
  this.length = 8;
  this.timestamp = +new Date;

  var _getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  this.generate = function() {
    var ts = this.timestamp.toString();
    var parts = ts.split("").reverse();
    var id = "";

    for (var i = 0; i < this.length; ++i) {
      var index = _getRandomInt(0, parts.length - 1);
      id += parts[index];
    }
    return id;
  }
}

document.addEventListener('DOMContentLoaded', function() {

  var ch = JSON.parse(localStorage.getItem('channels'));

  // By default, submit button is disabled
  document.querySelector('#channel-submit').disabled = true;

  // Enable button only if there is text in the input
  document.querySelector('#channel').onkeyup = () => {
    console.log("hello");

    if (document.querySelector('#channel').value.length > 0) {
      document.querySelector('#channel-submit').disabled = false;
    } else {
      document.querySelector('#channel-submit').disabled = true;
    }
  }

  document.querySelector('#new-channel').onsubmit = function() {
      console.log("let myChannel");

    let myChannel = document.querySelector('#channel').value;


    let j;
    for (j = 0; j < ch.length; j++) {
      if (myChannel == ch[j]['channel']) {
        alert(`Channel exists, please choose another one.`);
        myChannel = '';
      }
    };

    if (myChannel != '') {
      var generator = new IDGenerator();
      let channelId = generator.generate();
      ch.push({
        'id': channelId,
        'channel': myChannel
      });
      localStorage.setItem('channels', JSON.stringify(ch));

      // Clear input field and disable submit button again
      document.querySelector('#message').value = '';
      document.querySelector('#message-submit').disabled = true;
    }

    // Stop form from submitting
    return false;
  };
})