import React, { useEffect, useState } from 'react';

const Quiz = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    parseInt(localStorage.getItem('currentQuestionIndex'), 10) || 0
  );
  const [timeLeft, setTimeLeft] = useState(
    parseInt(localStorage.getItem('timeLeft'), 10) || 600
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setTimeLeft(600);
    setSelectedOption(null);
    setFeedback('');
    setScore(0);
    setQuizComplete(false);
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('timeLeft');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleQuizCompletion();
          return 0;
        }
        localStorage.setItem('timeLeft', prevTime - 1);
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
  }, [currentQuestionIndex]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (questions[currentQuestionIndex].answer === option) {
      setScore(prevScore => prevScore + 1);
      setFeedback('Correct answer!');
    } else {
      setFeedback('Incorrect answer.');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setFeedback('');
    } else {
      handleQuizCompletion();
    }
  };

  const handleQuizCompletion = () => {
    setQuizComplete(true);
    setTimeLeft(0); // Stop the timer
  };

  if (!questions.length) {
    return <div>Loading questions...</div>;
  }

  if (quizComplete) {
    return (
      <div>
        <h1>Quiz Complete</h1>
        <p>Thank you for completing the quiz!</p>
        <p>Your score is: {score} / {questions.length}</p>
        <button onClick={resetQuiz}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Quiz</h1>
      <div>Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</div>
      <div>
        <h2>{questions[currentQuestionIndex].question}</h2>
        {questions[currentQuestionIndex].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={selectedOption !== null}
            style={{
              backgroundColor:
                selectedOption === option
                  ? option === questions[currentQuestionIndex].answer
                    ? 'green'
                    : 'red'
                  : '',
            }}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && <div><strong>{feedback}</strong></div>}
      {selectedOption && (
        <button onClick={handleNextQuestion}>
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      )}
    </div>
  );
};

export default Quiz;
