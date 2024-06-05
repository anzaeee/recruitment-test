import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Q1 = () => {
  const [question] = useState("What is your favorite programming language?");
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const navigate = useNavigate();

  // Prompt user for camera access when component mounts
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setMediaStream(stream);
      })
      .catch((err) => console.error("Error accessing media devices: ", err));
  }, []);

  const startRecording = () => {
    if (videoRef.current && !recording) {
      const mediaRecorder = new MediaRecorder(mediaStream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setRecordedChunks(chunks);
        setRecording(false);
      };

      mediaRecorder.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaStream && recording) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  const recordAgain = () => {
    setRecordedVideoUrl(null);
    setRecordedChunks([]);
    startRecording();
  };

  const moveToNextQuestion = () => {
    navigate("/q2");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-black">
      <h1 className="text-2xl font-bold mb-4">{question}</h1>
      <div className="mb-4">
        {/* Show live preview until recording starts */}
        {!recording && !recordedVideoUrl && (
          <video ref={videoRef} autoPlay muted className="border rounded-lg" />
        )}
        {/* Show recorded video once recording ends */}
        {recordedVideoUrl && (
          <video src={recordedVideoUrl} controls className="border rounded-lg">
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      {!recordedVideoUrl ? (
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded-lg text-white ${
            recording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
      ) : (
        <div className="space-x-4">
          <button
            onClick={recordAgain}
            className="px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600"
          >
            Record Again
          </button>
          <button
            onClick={moveToNextQuestion}
            className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

export default Q1;
