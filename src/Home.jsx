// Home.js
import React from "react";

function Home({ onStart }) {
  return (
    <div className="home-main">
      <h1>AI-Based Interview Exam</h1>
      <button
        onClick={onStart}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Start the Exam
      </button>
    </div>
  );
}

export default Home;
