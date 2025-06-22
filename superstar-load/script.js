// Music Visualizer Setup
const audio = document.getElementById('audio');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 128;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function animate() {
  requestAnimationFrame(animate);

  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 100;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    const angle = (i / bufferLength) * Math.PI * 2;
    const x1 = centerX + Math.cos(angle) * radius;
    const y1 = centerY + Math.sin(angle) * radius;
    const x2 = centerX + Math.cos(angle) * (radius + barHeight);
    const y2 = centerY + Math.sin(angle) * (radius + barHeight);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `hsl(${i * 4}, 100%, 50%)`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Typing Text Effect
const textArray = [
  "Welcome to Superstar RP.",
  "A community-driven, high-quality roleplay experience.",
  "Custom jobs, vehicles, gangs & endless stories.",
  "Be whoever you want to be. Start your journey today."
];

let typedText = document.getElementById("typed-text");
let textIndex = 0;
let charIndex = 0;

function typeEffect() {
  if (charIndex < textArray[textIndex].length) {
    typedText.textContent += textArray[textIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeEffect, 50);
  } else {
    setTimeout(eraseEffect, 2000);
  }
}

function eraseEffect() {
  if (charIndex > 0) {
    typedText.textContent = textArray[textIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseEffect, 30);
  } else {
    textIndex = (textIndex + 1) % textArray.length;
    setTimeout(typeEffect, 500);
  }
}

window.addEventListener("load", () => {
  typeEffect();
});

// Click to resume audio context for browsers that block autoplay
window.addEventListener('click', () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
    audio.play();
  }
});

animate();
