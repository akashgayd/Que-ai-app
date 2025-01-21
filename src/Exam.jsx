import React, { useState, useEffect, useRef } from "react";

const Exam = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [progress, setProgress] = useState(100);

  const videoRef = useRef(null);
  const faceCheckInterval = useRef(null);
  const warningTimer = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch("https://eye-traker.onrender.com/api/questions")
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Error fetching questions:", error));

    startCamera();
    startFaceMonitoring();

    return () => {
      stopCamera();
      stopFaceMonitoring();
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timer === 0) {
      handleAnswer(null);
    } else {
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          setProgress((newTimer / 30) * 100);
          return newTimer;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timer]);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch(() => setCameraError("Unable to access the camera."));
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const startFaceMonitoring = () => {
    faceCheckInterval.current = setInterval(() => {
      const isLookingAway = Math.random() < 0.3;
      if (isLookingAway) {
        issueWarning();
      }
    }, 5000);
  };

  const stopFaceMonitoring = () => {
    clearInterval(faceCheckInterval.current);
    clearTimeout(warningTimer.current);
  };

  const issueWarning = () => {
    setWarnings((prev) => {
      const newWarnings = prev + 1;
      if (newWarnings <= 5) {
        showTemporaryWarning();
      }
      if (newWarnings === 4) {
        setIsFinished(true);
        stopCamera();
        stopFaceMonitoring();
      }
      return newWarnings;
    });
  };

  const showTemporaryWarning = () => {
    setShowWarning(true);
    warningTimer.current = setTimeout(() => {
      setShowWarning(false);
    }, 3000);
  };

  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestion]?.correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }
    setAnswers({ ...answers, [currentQuestion]: answer });
    setTimer(30);
    setProgress(100);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsFinished(true);
      stopCamera();
    }
  };

  const handleRestart = () => {
    setWarnings(0);
    setCurrentQuestion(0);
    setAnswers({});
    setIsFinished(false);
    setScore(0);
    setTimer(30);
    setProgress(100);
    startCamera();
    startFaceMonitoring();
  };

  const handleHomeRedirect = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-6">
      {!isFinished ? (
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl p-8 flex flex-col items-center">
          <div className="flex justify-center w-full mb-6">
            <div
              className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-indigo-500 rounded-full overflow-hidden bg-gray-900"
            >
              {cameraError ? (
                <p className="text-red-500 text-xs text-center">{cameraError}</p>
              ) : (
                <video ref={videoRef} className="w-full h-full object-cover" />
              )}
            </div>
          </div>

          {showWarning && (
            <div className="bg-red-600 text-white text-center font-bold px-4 py-2 rounded-lg shadow-lg animate-pulse mb-4">
              Warning: Please focus on the screen!
            </div>
          )}

          {questions.length > 0 ? (
            <div className="text-center w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                {questions[currentQuestion]?.question}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {questions[currentQuestion]?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300"
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-red-500 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">Time Left: {timer}s</p>
            </div>
          ) : (
            <p className="text-lg text-gray-700">Loading questions...</p>
          )}
        </div>
      ) : (
        <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {warnings >= 4 ? "Exam Over Due to Cheating" : "Exam Finished"}
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            {warnings >= 4
              ? "You received multiple warnings for suspicious activity."
              : `Your Score: ${score} / ${questions.length}`}
          </p>
          <button
            onClick={handleRestart}
            className="py-3 px-8 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 m-2"
          >
            Restart Exam
          </button>
          <button
            onClick={handleHomeRedirect}
            className="py-3 px-8 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 mt-4 m-2"
          >
            Go to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default Exam;
