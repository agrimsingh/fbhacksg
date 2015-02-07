function post() {
    var str = $('#transcript').html();
    //var xh = new XMLHttpRequest();
    //var fd = new FormData();
    //fd.append("text", str);
    //xh.open('POST', '/summary');
    //xh.send(fd);
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

var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

recognition.onstart = function() {
    $('textarea').val('recording');
};
var final_transcript;
recognition.onresult = function(event) {
    var interim_transcript = '';

    for (var i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
            var x = event.results[i][0].transcript;
            console.log(x);
            final_transcript += x;
        } else {
            interim_transcript += event.results[i][0].transcript;
        }
    }
    $('#transcript').html(final_transcript);
    $('#temp').html(interim_transcript);
};
recognition.onerror = function(event) {

};
recognition.onend = function() {
    alert ("recording ended");
};

function startRecording() {
    final_transcript = '';
    recognition.lang = 'en-US';
    recognition.start();
}