let localStream;
let peer;

async function startVideo() {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  document.getElementById('local-video').srcObject = localStream;

  peer = new SimplePeer({ initiator: location.hash === '#1', trickle: false, stream: localStream });

  peer.on('signal', data => {
    console.log('SIGNAL:', JSON.stringify(data));
    // Share the signal data manually or via socket
  });

  peer.on('stream', stream => {
    document.getElementById('remote-video').srcObject = stream;
  });
}

async function shareScreen() {
  const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  const videoTrack = screenStream.getVideoTracks()[0];
  const sender = peer.streams[0].getVideoTracks()[0];
  peer.replaceTrack(sender, videoTrack, localStream);
}

function stopMedia() {
  localStream.getTracks().forEach(track => track.stop());
  peer.destroy();
}
