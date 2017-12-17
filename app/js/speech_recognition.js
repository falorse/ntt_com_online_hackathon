//音声認識APIの使用
$(function() {
  var speech = new webkitSpeechRecognition();
  speech.lang = "ja";
  speech.continuous = true;
  speech.start();

  speech.addEventListener('result', function(e) {
    var length = e.results.length;
    const msg = e.results[length - 1][0].transcript;
    $('.messages').append('<div><span class="you">You: </spen>' + msg  + '</div>');
    peer.rooms['mesh_text_' + $('#roomName').val()].send(msg);
    $('#text').val('');
    $('#text').focus();
  });

});
