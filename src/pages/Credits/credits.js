import React from "react";

const Credits = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
      <div className="text-center bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Congratulations!</h1>
        <p className="mb-4">
          You have successfully completed the test. Well done!
        </p>
        <p className="mb-4">
          Thank you for participating. We appreciate your time and effort.
        </p>
        <p className="mb-4">
          You will be notified about the results via email.
        </p>
        <p className="mt-8">
          <a
            href="https://www.foretheta.com"
            className="px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600"
          >
            Back to Home
          </a>
        </p>
      </div>
    </div>
  );
};

export default Credits;
