import React from 'react';

const FullScreenPrompt = ({ enterFullScreen }) => {
  return (
    <div>
      <h1>Full Screen Mode Required</h1>
      <p>Please enable full-screen mode to start the quiz.</p>
      <button onClick={enterFullScreen}>Enter Full Screen</button>
    </div>
  );
};

export default FullScreenPrompt;
