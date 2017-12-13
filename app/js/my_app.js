// connect to a chatroom (call by when peer enter video room)

var enterToChatroom = function(){
    e.preventDefault();
    const roomName = $('#join-room').val();
    if (!roomName) {
      return;
    }
    if (!connectedPeers[roomName]) {
      // Create 2 connections, one labelled chat and another labelled file.
      const room = peer.joinRoom('mesh_text_' + roomName);
      room.on('open', function() {
        connect(room);
        connectedPeers[roomName] = room;
      });
};  

var enterToVideoroom = function(){
	e.preventDefault();
    // Initiate a call!
    const roomName = $('#join-room').val();
    if (!roomName) {
      return;
    }
    room = peer.joinRoom('mesh_video_' + roomName, {stream: localStream});

    $('#room-id').text(roomName);
    step3(room);
};

/* eslint-disable require-jsdoc */
/**
 * SkyWay Screenshare Sample App
 * @author NTT Communications(skyway@ntt.com)
 * @link https://github.com/nttcom/ECLRTC-ScreenShare
 * @license MIT License
 */


$(function() {
    // API key (bc26d227-0bf2-460a-b2cb-129a0dfafdc2 can only be used on localhost)
    // const APIKEY = 'bc26d227-0bf2-460a-b2cb-129a0dfafdc2';
    const APIKEY = window.__SKYWAY_KEY__;

    // Call object
    let existingCall = null;

    // localStream
    let localStream = null;

    // Create Peer object
    // const peer = new Peer({key: APIKEY, debug: 3});

    alert(peer.id);
    // Prepare screen share object
    const ss = ScreenShare.create({debug: true});

    // Get peer id from server
    peer.on('open', () => {
    	alert("aaa");
      $('#my-id').text(peer.id);
    });

    // Set your own stream and answer if you get a call
    peer.on('call', call => {
    	alert("aaaa");
      call.answer(localStream);
      step3(call);
      console.log('event:recall');
    });

    // Error handler
    peer.on('error', err => {
      alert(err.message);
      step2();
    });

  // Call peer
  $('#make-call').on('click', () => {
	  alert("aaa");
    const call = peer.call($('#otherpeerid').val(), localStream);
    step3(call);
  });

  // Finish call
  $('#end-call').on('click', () => {
    existingCall.close();
    step2();
  });

  // Get media stream again
  $('#step1-retry').on('click', () => {
    $('#step1-error').hide();
    step1();
  });

  // Start screenshare
  $('#start-screen').on('click', () => {
    if (ss.isScreenShareAvailable() === false) {
      alert('Screen Share cannot be used. Please install the Chrome extension.');
      return;
    }

    ss.start({
      width:     $('#Width').val(),
      height:    $('#Height').val(),
      frameRate: $('#FrameRate').val(),
    })
      .then(stream => {
        $('#my-video')[0].srcObject = stream;

        if (existingCall !== null) {
          const peerid = existingCall.peer;
          existingCall.close();
          const call = peer.call(peerid, stream);
          step3(call);
        }
        localStream = stream;
      })
      .catch(error => {
          console.log(error);
      });
  });

  // End screenshare
  $('#stop-screen').on('click', () => {
    ss.stop();
    localStream.getTracks().forEach(track => track.stop());
  });

  // Camera
  $('#start-camera').on('click', () => {
    navigator.mediaDevices.getUserMedia({audio: true, video: true})
      .then(stream => {
        $('#my-video')[0].srcObject = stream;

        if (existingCall !== null) {
          const peerid = existingCall.peer;
          existingCall.close();
          const call = peer.call(peerid, stream);
          step3(call);
        }
        localStream = stream;
      })
      .catch(err => {
        $('#step1-error').show();
      });
  });

  // Start step 1
  step1();

  function step1() {
    navigator.mediaDevices.getUserMedia({audio: true, video: true})
      .then(stream => {
        $('#my-video')[0].srcObject = stream;
        localStream = stream;
        step2();
      })
      .catch(err => {
        $('#step1-error').show();
      });
  }

  function step2() {
    // Update UI
    $('#step1, #step3').hide();
    $('#step2').show();
  }

  function step3(call) {
    // Close any existing calls
    if (existingCall) {
      existingCall.close();
    }

    // Wait for peer's media stream
    call.on('stream', stream => {
      $('#their-video')[0].srcObject = stream;
      $('#step1, #step2').hide();
      $('#step3').show();
    });

    // If the peer closes their connection
    call.on('close', step2);

    // Save call object
    existingCall = call;

    // Update UI
    $('#their-id').text(call.peer);
    $('#step1, #step2').hide();
    $('#step3').show();
  }
});
