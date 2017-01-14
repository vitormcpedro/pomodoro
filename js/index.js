/* Initial setup */
var sessionLengthMin = 25;
var breakLengthMin = 5;
var soundFileURL = "https://dl.dropboxusercontent.com/u/314204/slide_in";
/* ------------- */

var timeSeconds = sessionLengthMin*60;
var countingDown = false;
var interval;
var currentState = 'Session';
var progress;

function resetTimeSeconds() {
  if(currentState == 'Session') {
    timeSeconds = sessionLengthMin*60;
  } else {
    timeSeconds = breakLengthMin*60;
  }
}

function resetProgressBar() {
  var color = "#ffffff";
  if(currentState == 'Session') {
    color = "#009933";
  } else {
    color = "#ff4d4d";
  }
  
  progress = $("#timer").shieldProgressBar({
    min: 0,
    max: 100,
    value: 0,
    layout: "circular",
    layoutOptions: {
      circular: {
        borderColor: color,
        width: 15,
        borderWidth: 1,
        color: color,
        backgroundColor: "#424242"
      }
    },
    text: {
      enabled: true,
      template: '<p class="time-info text-center" id="state">'+currentState+'</p><p class="time-info text-center" id="time">'+Math.floor(timeSeconds/60)+'</p>'
      },
  }).swidget();
}

function playSound(){
 
 //document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" /></audio>';
  document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="' + soundFileURL + '.mp3" type="audio/mpeg" /><embed hidden="true" autostart="true" loop="false" src="' + soundFileURL +'.mp3" /></audio>';
}

function toggleState() {
  if(currentState == 'Session') {
    currentState = 'Break';
  } else {
    currentState = 'Session';
  }
  playSound();
}

function updateProgressBar() {
  var percent = 0;
  if(currentState=='Session') {
    percent = 100 - (timeSeconds/(sessionLengthMin*60))*100;
  } else {
    percent = 100 - (timeSeconds/(breakLengthMin*60))*100;
  }
  progress.value(percent);
}

function updateTimer() {
  if (timeSeconds == 0 ) {
    toggleState();
    resetTimeSeconds();
    resetProgressBar()
  }
  
  var sec = timeSeconds % 60;
  if(sec < 10) {
    sec = '0' + sec;
  }
  var min = Math.floor(timeSeconds/60);

  updateProgressBar();
  $("#time").text(min+':'+sec);
  $("#state").text(currentState);
}

$(document).ready(function() {
  $("#break-length").text(breakLengthMin);
  $("#session-length").text(sessionLengthMin);
  resetProgressBar();
  $("#time").text(sessionLengthMin);
  $("#state").text(currentState);
  
  $('#reset').on('click', function() {
    resetTimeSeconds();
    updateTimer();
  });
});

$("#decrease-break-length").click(function() {
  if(breakLengthMin <= 1 || countingDown) {
    return;
  }
  breakLengthMin--;
  $("#break-length").text(breakLengthMin);
  if(currentState == 'Break') {
    resetTimeSeconds();
    updateTimer();
  }
});

$("#increase-break-length").click(function() {
  if(countingDown) {
    return;
  }
  breakLengthMin++;
  $("#break-length").text(breakLengthMin);
  if(currentState == 'Break') {
    resetTimeSeconds();
    updateTimer();
  }
});

$("#decrease-session-length").click(function() {
  if(sessionLengthMin <= 1 || countingDown) {
    return;
  }
  sessionLengthMin--;
  $("#session-length").text(sessionLengthMin);
  if(currentState == 'Session') {
    resetTimeSeconds();
    updateTimer();
  }
});

$("#increase-session-length").click(function() {
  if(countingDown) {
    return;
  }
  sessionLengthMin++;
  $("#session-length").text(sessionLengthMin);
  if(currentState == 'Session') {
    resetTimeSeconds();
    updateTimer();
  }
});

$("#timer").click(function() {
  if(countingDown) {
    clearInterval(interval);
    countingDown = false;
    return;
  }
  countingDown = true;
  interval = setInterval(function(){
    timeSeconds--;
    updateTimer();
  }, 1000);

});