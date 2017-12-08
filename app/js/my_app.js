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
