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

    const connectedPeers = {};
    // Call object
    let existingCall = null;

    // localStream
    let localStream = null;

    // Create Peer object
    // const peer = new Peer({key: APIKEY, debug: 3});

//    alert("aaa");
//    alert(peer.id);
    // Prepare screen share object
    const ss = ScreenShare.create({debug: true});

    // Get peer id from server
//    peer.on('open', () => {
//    	alert("aaa");
//      $('#my-id').text(peer.id);
//    });

    // Set your own stream and answer if you get a call
    peer.on('call', call => {
      call.answer(localStream);
      ss_step3(call);
      console.log('event:recall');
    });

    // Error handler
    peer.on('error', err => {
      alert(err.message);
      ss_step2();
    });

  // Call peer
  $('#make-call').on('click', () => {
    const call = peer.call($('#otherpeerid').val(), localStream);
    ss_step3(call);
  });

  // join room
  $('#connect').on('submit', e => {
    e.preventDefault();
	  
    const roomName = $('#roomName').val();
    if (!roomName) {
      return;
    }
    room = peer.joinRoom('mesh_video_' + roomName, {stream: localStream});

    $('#room-id').text(roomName);
    ss_join_room(room);    
  });


  // join room 
  function ss_join_room(room){
	  room.on('stream', stream =>{
        const peerId = stream.peerId;
        const call = peer.call(peerId, null);
        // TODOタブを追加(id = ss_peerId)
        
        console.log(peerId);
        ss_step3(call);
	  });
  };
  
  // Finish call
  $('#end-call').on('click', () => {
    existingCall.close();
    ss_step2();
  });

  // Get media stream again
  $('#ss_step1-retry').on('click', () => {
    $('#ss_step1-error').hide();
    ss_step1();
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
        $('#ss_my-video')[0].srcObject = stream;

        if (existingCall !== null) {
          const peerid = existingCall.peer;
          existingCall.close();
          const call = peer.call(peerid, stream);
          ss_step3(call);
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
        $('#ss_my-video')[0].srcObject = stream;

        if (existingCall !== null) {
          const peerid = existingCall.peer;
          existingCall.close();
          const call = peer.call(peerid, stream);
          ss_step3(call);
        }
        localStream = stream;
      })
      .catch(err => {
        $('#ss_step1-error').show();
      });
  });

  // Start ss_step 1
  ss_step1();

  function ss_step1() {
    navigator.mediaDevices.getUserMedia({audio: true, video: true})
      .then(stream => {
        $('#my-video')[0].srcObject = stream;
        localStream = stream;
        ss_step2();
      })
      .catch(err => {
        $('#ss_step1-error').show();
      });
  }

  function ss_step2() {
    // Update UI
    $('#ss_step1, #ss_step3').hide();
    $('#ss_step2').show();
  }

  function ss_step3(call) {
    // Close any existing calls
    if (existingCall) {
      existingCall.close();
    }

    // Wait for peer's media stream
    call.on('stream', stream => {
      $('#ss_their-video')[0].srcObject = stream;
      $('#ss_step1, #ss_step2').hide();
      $('#ss_step3').show();
    });

    // If the peer closes their connection
    call.on('close', ss_step2);

    // Save call object
    existingCall = call;

    // Update UI
    $('#ss_their-id').text(call.peer);
    $('#ss_step1, #ss_step2').hide();
    $('#ss_step3').show();
  }
});
