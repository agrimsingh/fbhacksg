var final_transcript = '';
var transcriptBuffer = '';
var interim_transcript = '';
var resultsList = [];
var keywords = {};
var wordCloud = [];

var recognition = new webkitSpeechRecognition();
var recording = false;
recognition.continuous = true;
recognition.interimResults = true;

var myApp = angular.module('myApp', [
    'angular-jqcloud'
]);

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
    var obj = JSON.parse(result);
    obj.forEach(function(dict) {
        resultsList.push(dict);
    });
    //resultsList.push(obj);
    updateKeywords();
    updateWordCloud()
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

function updateWordCloud() {
    wordCloud = [];
    for (var keyword in keywords) {
        if (!keywords.hasOwnProperty(keyword)) continue;
        wordCloud.push({
            text: keyword,
            weight: 1//keywords[keyword].length
        });
    }
    return wordCloud;
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


myApp.controller('speechTextController', function ($scope, $http) {
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
    $scope.wordCloud = function() {
        return wordCloud;
    }
    $scope.sentence = function(index) {
        return resultsList[index].sentence;
    }

    $scope.colors = ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#feb24c", "#fed976"];

});