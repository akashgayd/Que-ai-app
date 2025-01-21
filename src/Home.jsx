// Home.js
import React, { useState, useEffect } from "react";

function Home({ onStart }) {
  const [welcomeText, setWelcomeText] = useState("Welcome to the AI-Based Interview Exam");

  // Random welcome messages
  const messages = [
    "Ace Your Next Interview with AI Insights!",
    "Welcome to Your Path to Success!",
    "Showcase Your Skills and Shine Bright!",
    "Your Future Starts Here!",
    "Get Ready to Master Your Interview Skills!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setWelcomeText(messages[randomIndex]);
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-4">
      <div className="text-center p-8 rounded-xl shadow-xl bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 animate-pulse">{welcomeText}</h1>
        <p className="text-base md:text-lg mb-6 leading-relaxed">
          Prepare to showcase your talents and let your confidence shine. With dedication and effort, success is within your reach!
        </p>
        <button
          onClick={onStart}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white text-lg md:text-xl font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none"
        >
          Start the Exam
        </button>
      </div>
      <footer className="mt-8 text-sm text-white text-opacity-70">
        Optimized for all devices. Let’s make this journey memorable!
      </footer>
    </div>
  );
}

export default Home;
