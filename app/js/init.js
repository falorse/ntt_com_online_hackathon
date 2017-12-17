const peer = new Peer({
  // Set API key for cloud server (you don't need this if you're running your
  // own.
  key:         window.__SKYWAY_KEY__,
  // Set highest debug level (log everything!).
  debug:       3,
  // Set a logging function:
  logFunction: args => {
    const copy = [...args].join(' ');
    $('.log').append(copy + '<br>');
  },
});
