import React, { useState, useRef } from 'react';
import './MainScreen.css';
import { FaInfoCircle, FaMoon, FaUndo, FaCog, FaImage, FaMicrophone, FaPowerOff } from 'react-icons/fa';
import { MdTextFields } from 'react-icons/md';

const MainScreen = () => {
  const [selectedMode, setSelectedMode] = useState('image'); // image | text | audio
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    setFile(null);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const validTypes = {
        image: ['image/png', 'image/jpeg'],
        text: ['text/plain'],
        audio: ['audio/mpeg', 'audio/wav']
      };

      if (validTypes[selectedMode].includes(selected.type)) {
        setFile(selected);
      } else {
        alert(`Invalid file type for ${selectedMode}`);
        setFile(null);
      }
    }
  };

  const handleDetect = () => {
    if (!file) {
      alert("Please upload a file before detecting.");
      return;
    }

    // Simulated upload logic
    console.log(`Uploading ${selectedMode} file:`, file);
    alert(`Detecting ${selectedMode} content from uploaded file: ${file.name}`);
    // Here you'd send it to your backend for AI processing
  };

  const triggerFileInput = () => inputRef.current?.click();

  return (
    <div className="main-container">
      <div className="main-header">
        <FaInfoCircle className="icon" />
        <FaMoon className="icon" />
        <h1 className="title">EchoMark</h1>
        <FaUndo className="icon" />
        <FaCog className="icon" />
      </div>

      <div className="mode-selector">
        <button className={`mode-button ${selectedMode === 'image' ? 'active' : ''}`} onClick={() => handleModeChange('image')}>
          <FaImage /> Image
        </button>
        <button className={`mode-button ${selectedMode === 'text' ? 'active' : ''}`} onClick={() => handleModeChange('text')}>
          <MdTextFields /> Text
        </button>
        <button className={`mode-button ${selectedMode === 'audio' ? 'active' : ''}`} onClick={() => handleModeChange('audio')}>
          <FaMicrophone /> Audio
        </button>
      </div>

      <div className="scanner-section">
        <FaPowerOff className="power-icon" />
        <button className="enable-button">Enable Scanning</button>
        <p className="instruction-text">Enable scanning to get AI detection results.</p>
      </div>

      <div className="divider">
        <span className="line"></span>
        <span className="or-text">OR</span>
        <span className="line"></span>
      </div>

      <div className="upload-section">
        <div className="upload-box" onClick={triggerFileInput}>
          <p>{file ? `Selected: ${file.name}` : `DROP or browse the ${selectedMode} file`}</p>
          <p className="format-text">
            {selectedMode === 'image' && 'Supported: .jpg, .png'}
            {selectedMode === 'text' && 'Supported: .txt'}
            {selectedMode === 'audio' && 'Supported: .mp3, .wav'}
          </p>
          <input
            type="file"
            accept={
              selectedMode === 'image'
                ? 'image/png, image/jpeg'
                : selectedMode === 'text'
                ? 'text/plain'
                : 'audio/*'
            }
            style={{ display: 'none' }}
            ref={inputRef}
            onChange={handleFileChange}
          />
        </div>
        <button className="detect-button" onClick={handleDetect}>Detect</button>
      </div>
    </div>
  );
};

export default MainScreen;
