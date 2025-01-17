// App.js
import React, { useState } from "react";
import Home from "./Home";
import Exam from "./Exam";

function App() {
  const [examStarted, setExamStarted] = useState(false);

  return (
    <div>
      {examStarted ? (
        <Exam onEnd={() => setExamStarted(false)} />
      ) : (
        <Home onStart={() => setExamStarted(true)} />
      )}
    </div>
  );
}

export default App;
