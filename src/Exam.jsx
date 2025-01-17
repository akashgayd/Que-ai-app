import React, { useState, useEffect, useRef } from "react";
import "./App.css"; 

const questions = [
  {
    id: 1,
    question: "What is React?",
    options: ["Library", "Framework", "Language", "Tool"],
    answer: "Library",
  },
  {
    id: 2,
    question: "What is JSX?",
    options: [
      "JavaScript Extension",
      "Java Syntax",
      "JSON",
      "None of the above",
    ],
    answer: "JavaScript Extension",
  },
  {
    id: 3,
    question: "What is the use of useState?",
    options: [
      "For routing",
      "To manage state",
      "For API calls",
      "None of the above",
    ],
    answer: "To manage state",
  },
  {
    id: 4,
    question: "Which company developed React?",
    options: ["Google", "Facebook", "Apple", "Microsoft"],
    answer: "Facebook",
  },
  {
    id: 5,
    question: "What is a React Hook?",
    options: [
      "A lifecycle method",
      "A state management tool",
      "A function to use React features",
      "None of the above",
    ],
    answer: "A function to use React features",
  },
];

function Exam({ onEnd }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        alert("Unable to access the camera: " + error.message);
      }
    };

    startCamera();

    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setWarnings((prev) => prev + 1);
        alert("Warning! Keep your face and eyes on the screen.");
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (warnings >= 4) {
      alert("Maximum warnings reached! Redirecting to home page.");
      onEnd();
    }
  }, [warnings, onEnd]);

  const handleAnswer = (selectedOption) => {
    if (questions[currentQuestionIndex].answer === selectedOption) {
      setScore((prev) => prev + 20);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      alert(`Exam over! Your score is: ${score + 20}`);
      onEnd();
    }
  };

  return (
    <div className="exam-container">
      <h2 className="question-header">
        Question {currentQuestionIndex + 1}
      </h2>
      <p className="question-text">
        {questions[currentQuestionIndex].question}
      </p>
      {questions[currentQuestionIndex].options.map((option, index) => (
        <button
          key={index}
          className="option-button"
          onClick={() => handleAnswer(option)}
        >
          {option}
        </button>
      ))}
      <p className="warnings">
        Warnings: {warnings}/4
      </p>
      <div className="camera-container">
        <video ref={videoRef} autoPlay muted className="camera-feed" />
      </div>
    </div>
  );
}

export default Exam;
