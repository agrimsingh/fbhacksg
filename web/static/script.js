var final_transcript;
var recognition = new webkitSpeechRecognition();
var recording = false;
recognition.continuous = true;
recognition.interimResults = true;

function post() {
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
}

recognition.onstart = function() {
    recording = true;
    console.log("RECORDING,..,.,.,.,.");
    $('textarea').val('recording');
};

recognition.onresult = function(event) {
    console.log("RESULT!!!!");
    var interim_transcript = '';

    for (var i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
            var x = event.results[i][0].transcript;
            console.log(x);
            console.log(final_transcript);
            final_transcript += x;
        } else {
            interim_transcript += event.results[i][0].transcript;
        }
    }
    $('#transcript').html(final_transcript);
    $('#temp').html(interim_transcript);
};

recognition.onerror = function(event) {
    console.log("ERROR-----");
};

recognition.onend = function(event) {
    recording = false;
    console.log("END-----");
};

function addFullStop() {
    console.log(final_transcript);
    final_transcript += '.';
    $('#transcript').html(final_transcript);
    $('#temp').html('');
}

function startRecording() {
    if (recording) {
        recognition.stop();
        return;
    }

    final_transcript = '';
    recognition.lang = 'en-US';
    recognition.start();
    //angular.element($('#controller')).scope().asdf('aaaa');
    angular.element($('#controller')).scope().$apply();
}


function speechTextController($scope, $http) {
    $scope.currentText = function() {
        return final_transcript;
    }
}