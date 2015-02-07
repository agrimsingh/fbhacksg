var final_transcript = '';
var transcriptBuffer = '';
var interim_transcript = '';
var resultsList = [];

var recognition = new webkitSpeechRecognition();
var recording = false;
recognition.continuous = true;
recognition.interimResults = true;

/*function post() {
    var str = $('#transcript').html();
    $.ajax({
        url: '/summary',
        type: 'POST',
        data: {
            text: str
        }
    }).done(function (data) {
        alert(data);
    });
}*/

function sendPost(message) {
    $.ajax({
        url: '/summary',
        type: 'POST',
        data: {
            text: message
        }
    }).done(function (data) {
        console.log(data);
        addToResults(data);
    });
}


timeToNext = -1;
timeoutFrames = 100;
function updateInterim(message) {
    interim_transcript = message;
    timeToNext = timeoutFrames;
    update();
}

/*
function updateFinal(message) {
    final_transcript += message;
    update();
}*/

function flushMessage() {
    append = interim_transcript + '.';

    final_transcript += append;
    transcriptBuffer += append;
    interim_transcript = '';
    timeToNext = -1;
    update();
}

function submitCurrent() {
    sendPost(transcriptBuffer);
    transcriptBuffer = '';
}

var interval = function() {
    if (timeToNext > 0) {
        timeToNext -= 1;
        if (timeToNext <= 0) {
            flushMessage();
        }
    }
    setTimeout(interval, 10);
}
//interval();

function addToResults(result) {
    resultsList.push(result);
    update();
}


recognition.onstart = function() {
    recording = true;
    console.log("RECORDING,..,.,.,.,.");
    $('textarea').val('recording');
};

recognition.onresult = function(event) {
    console.log("RESULT!!!!");
    interim_transcript = '';

    for (var i = event.resultIndex; i < event.results.length; i++) {
        updateInterim(event.results[i][0].transcript);
        if (event.results[i].isFinal) {
            flushMessage();
        }
    }
};

recognition.onerror = function(event) {
    console.log("ERROR-----");
};

recognition.onend = function(event) {
    recording = false;
    submitCurrent();
    console.log("END-----");
};

function addFullStop() {
    console.log(final_transcript);
    final_transcript += '.';
    $('#transcript').html(final_transcript);
    $('#temp').html('');
}

function update() {
    angular.element($('#controller')).scope().$apply();
}

function startRecording() {
    if (recording) {
        recognition.stop();
        return;
    }

    final_transcript = '';
    recognition.lang = 'en-US';
    recognition.start();
}

function processResults(list) {
    return list.join('<br>');
}


function speechTextController($scope, $http) {
    $scope.currentText = function() {
        return final_transcript;
    }
    $scope.currentLine = function() {
        return interim_transcript;
    }
    $scope.results = function() {
        return processResults(resultsList);
    }
}