var final_transcript = '';
var transcriptBuffer = '';
var interim_transcript = '';
var resultsList = [];
var keywords = {};

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
        addToResults(data);
    });
}


timeToNext = -1;
timeoutFrames = 50;
bounce = false;
earlyEnded = true;
earlyEndTranscript = null;

function updateInterim(message) {
    interim_transcript += message;
    timeToNext = timeoutFrames;
    update();
}

/*
function updateFinal(message) {
    final_transcript += message;
    update();
}*/

function flushMessage() {
    var append;
    append = interim_transcript + '.';
    if (earlyEnded) {
        append = insertDot(append);
    }

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

function earlyEnd() {
    //console.log("EARLYEND");
    //console.log(interim_transcript);
    earlyEnded = true;
    earlyEndTranscript = interim_transcript;
    /*if (recording) {
        bounce = true;
        recognition.stop();
    }*/
}

function insertDot(message) {
    var i = 0;
    len = Math.min(earlyEndTranscript.length, message.length);
    while (i < len) {
        if (earlyEndTranscript.charAt(i) != message.charAt(i)) {
            break;
        }
        i++;
    }
    while (i > 0 && message.charAt(i-1) == ' ') {
        i--;
    }
    if (i > 0 && i < len) {
        return message.substr(0,i) + '.' + message.substr(i);
    } else {
        return message;
    }
}

var interval = function() {
    if (timeToNext > 0) {
        timeToNext -= 1;
        if (timeToNext <= 0) {
            earlyEnd();
        }
    }
    setTimeout(interval, 10);
}
interval();

function addToResults(result) {
    var obj = JSON.parse(result);
    obj.forEach(function(dict) {
        resultsList.push(dict);
    });
    //resultsList.push(obj);
    updateKeywords();
    update();
}

function updateKeywords() {
    keywords = {};
    for (var i=0; i<resultsList.length; i++) {
        result = resultsList[i];
        for (var j=0; j<result.keywords.length; j++) {
            keyword = result.keywords[j];
            if (keywords.hasOwnProperty(keyword)) {
                keywords[keyword].push(i);
            } else {
                keywords[keyword] = [i];
            }
        }
    }
    return keywords;
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
    if (bounce === true) {
        recognition.start();
    }
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
        return resultsList;
    }
    $scope.keywords = function() {
        return keywords;
    }
    $scope.sentence = function(index) {
        return resultsList[index].sentence;
    }
}