import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError("Invalid email format");
      return;
    }

    // Store name and email in sessionStorage
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("email", email);

    setSubmitting(true);

    try {
      // Send a POST request to create the folder on the backend
      const response = await fetch("http://localhost:3001/create-folder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderName: name }),
      });

      if (response.ok) {
        const data = await response.json();
        const folderId = data.folderId;
        sessionStorage.setItem("folderId", folderId);
        setSubmitting(false);
        navigate("/q1", { state: { name, email } });
      } else {
        setSubmitting(false);
        alert("Failed to create folder on the server. Please try again.");
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      setSubmitting(false);
      alert("Error creating folder. Please try again.");
    }
  };

  useEffect(() => {
    document.title = "Recruitment Test - Foretheta";
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
      <div className="text-center bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">
          Welcome and Congratulations on making it this far!
        </h1>
        <p className="mb-4">
          Please record ONE video with your answer to the question(s) that will
          be shown to you on the screen.
        </p>
        <p className="mb-4">
          Use your COMPUTER webcam, NOT a phone. Simply imagine you are sitting
          in front of me in an interview and naturally answer the questions as
          if you are talking to me. The more genuine you sound, the more
          impressive it will be.
        </p>
        <p className="mb-4">
          When you click Stop recording, WAIT for the video to finish processing
          and THEN you can replay it.
        </p>
        <p className="mb-2 text-red-800">
          Note: Please use Firefox, Chrome, or Edge to be able to playback your
          recording.
        </p>
        <form onSubmit={handleSubmit} className="text-center">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-black text-left">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-black text-left">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
          {formError && <p className="text-red-500 mb-2">{formError}</p>}
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600"
            disabled={submitting}
          >
            Start Test
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
