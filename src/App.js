import React, { useState, useEffect, createRef } from 'react';
import logo from './logo.svg';
import './App.css';
import Peer from "peerjs";

const peer = new Peer(null, {
  host: '192.168.10.123',
  port: 9000,
  path: '/peer-server'
});
const getMedia = config => {
  return navigator.mediaDevices.getUserMedia(config);
}

function App() {

  const [idPeer, setIdPeer] = useState(null);
  const [audio, setAudio] = useState(false);
  const [idCall, setIdCall] = useState(null);
  const video = createRef(null);

  useEffect(() => {
    peer.on('open', id => {
      setIdPeer(id);
    })
  }, []);

  const idCallChange = function(e) {
    setIdCall(e.target.value);
  }

  const callPeer = (id, stream) => {
    const call = peer.call(id, stream);
    call.on('stream', rmStream => {
      video.current.srcObject = rmStream;
    })
  }

  const clickCall = () => {
    getMedia({
      audio: true,
      video: true
    }).then(stream => {
      callPeer(idCall, stream);
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <div className="App">
      <p>Id peer: {idPeer?idPeer:''}</p>
      <input onChange={idCallChange}/>
      <button
        onClick={clickCall}
      >Call</button>
      <video autoPlay ref={video}></video>
    </div>
  );
}

export default App;
