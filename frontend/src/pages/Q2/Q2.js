import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Q2 = () => {
  const [question] = useState("Q2?");
  const videoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [maxRecordingDuration] = useState(60); // Maximum recording duration in seconds (1 minute)
  const [timer, setTimer] = useState(0); // Timer to track elapsed recording time
  const name = sessionStorage.getItem("name");
  const folderId = sessionStorage.getItem("folderId"); // Retrieve folderId from session storage
  const navigate = useNavigate();

  const [intervalId, setIntervalId] = useState(null); // State to hold interval id

  // Prompt user for camera access when component mounts
  useEffect(() => {
    document.title = "Recruitment Test - Q2";
    startMediaStream();
  }, []);

  const startMediaStream = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setMediaStream(stream);
      })
      .catch((err) => console.error("Error accessing media devices: ", err));
  };

  const startRecording = () => {
    if (videoRef.current && !recording && mediaStream) {
      const mediaRecorder = new MediaRecorder(mediaStream);
      const chunks = [];
      let timeElapsed = 0;

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks);
        const blob = new Blob(chunks, { type: "video/mp4" });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setRecording(false);
      };

      // Start recording
      mediaRecorder.start();
      setRecording(true);

      // Start timer to check elapsed time
      const id = setInterval(() => {
        timeElapsed += 1;
        setTimer(timeElapsed);

        // Check if maximum duration exceeded
        if (timeElapsed >= maxRecordingDuration) {
          clearInterval(id);
          mediaRecorder.stop();
          alert(
            "Maximum recording duration exceeded (1 minute). Please re-record or move to the next question."
          );
        }
      }, 1000); // Update timer every second (1000 milliseconds)

      // Store interval id in state
      setIntervalId(id);
    }
  };

  const stopRecording = () => {
    if (mediaStream && recording) {
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => track.stop());
      setRecording(false);
      setMediaStream(null);
      clearInterval(intervalId); // Clear timer interval
    }
  };

  const recordAgain = () => {
    setRecordedVideoUrl(null);
    setRecordedChunks([]);
    startMediaStream();
    setTimer(0); // Reset timer
  };

  const moveToNextQuestion = async () => {
    if (recordedChunks.length > 0) {
      setSubmitting(true);
      const blob = new Blob(recordedChunks, { type: "video/mp4" });
      const formData = new FormData();
      formData.append("file", blob, `${name}_q2.mp4`);
      formData.append("folderId", folderId);

      try {
        const response = await fetch("http://localhost:3001/upload-video", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log("Video uploaded successfully!");
          setSubmitting(false);
          navigate("/q3");
        } else {
          console.error("Failed to upload video:", response.statusText);
          setSubmitting(false);
          alert("Failed to upload video. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading video:", error);
        setSubmitting(false);
        alert("Error uploading video. Please try again.");
      }
    }
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
      {/* Display timer */}
      {recording && (
        <div className="text-center mb-4 text-sm text-gray-500">
          Recording: {timer} sec / {maxRecordingDuration} sec
        </div>
      )}
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
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Next Question"}
          </button>
        </div>
      )}
      {submitting && (
        <div className="mt-4 text-blue-500 font-semibold">
          Submitting video answer... Please wait.
        </div>
      )}
    </div>
  );
};

export default Q2;
