import React, { useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';

import './App.css';
import memeTemplates from './memeTemplates.json';

function App() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [meme, setMeme] = useState(memeTemplates[0].value);

  function onCaptionInput(event){
    setCaption(event.target.value);
  }

  function onMemeSelect(event) {
    setMeme(event.target.value);
  }

  async function downloadMeme() {
    const canvas = canvasRef.current;
    const blob = await new Promise(resolve => canvas.toBlob(resolve));
    saveAs(blob, 'meme.png');
  }

  async function loadMemeTemplate(memeValue) {
    const template = memeTemplates.find(template => template.value === memeValue);
    const img = new window.Image();

    const imgLoadPromise = new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    img.src = process.env.PUBLIC_URL + template.path;
    await imgLoadPromise;
    setImage(img);
  }

  function drawCanvas(image, caption) {
    const { height, width } = image;
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0);
    ctx.font = "40px sans-serif";
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(caption, width * 0.5, height * 0.15);
    ctx.strokeText(caption, width * 0.5, height * 0.15);
  }

  useEffect(() => {
    loadMemeTemplate(meme)
  }, [meme]);

  useEffect(() => {
    if (image) {
      drawCanvas(image, caption);
    }
  }, [image, caption, canvasRef]);

  return (
    <div className="App">
      <label>
        Select a meme template <br />
        <select value={meme} onChange={onMemeSelect}>
          { memeTemplates.map(template =>
            <option key={template.value} value={template.value}>{template.text}</option>
          )}
        </select>
      </label>
      <label>
        Enter your meme caption <br />
        <input type="text" value={caption} onChange={onCaptionInput} />
      </label>
      <canvas ref={canvasRef} />
      <button onClick={downloadMeme}>Download</button>
    </div>
  );
}

export default App;