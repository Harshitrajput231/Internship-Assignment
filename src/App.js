import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Quiz from './Quiz';
import FullScreenPrompt from './FullScreenPrompt';
import './styles.css';

Modal.setAppElement('#root');

const App = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch('/questions.json')
      .then(response => response.json())
      .then(data => setQuestions(data))
      .catch(error => console.error('Error fetching questions:', error));

    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const enterFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
  };

  useEffect(() => {
    if (!isFullScreen) {
      enterFullScreen();
    }
  }, [isFullScreen]);

  return (
    <div>
      {isFullScreen ? (
        <Quiz questions={questions} />
      ) : (
        <FullScreenPrompt enterFullScreen={enterFullScreen} />
      )}
      <Modal
        isOpen={!isFullScreen}
        contentLabel="Full Screen Required"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h1>Full Screen Mode Required</h1>
        <p>Please enable full-screen mode to start the quiz.</p>
        <button onClick={enterFullScreen}>Enter Full Screen</button>
      </Modal>
    </div>
  );
};

export default App;
