import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load data from local storage if available
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");
    if (storedName && storedEmail) {
      setName(storedName);
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    setSubmitted(true);
    navigate("/q1", { state: { name, email } });
  };

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
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600"
          >
            Start Test
          </button>
        </form>
      </div>
    </div>
  );
}
