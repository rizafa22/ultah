/* ========================================================
   SPESIAL UNTUKMU - BIRTHDAY & LOVE INTERACTIVE WEB APP
   Interactive Logic, Audio Synthesizer, Confetti & State
   ======================================================== */

// Default Configuration matching the provided screenshots
const DEFAULT_CONFIG = {
  recipientName: 'Zahra Cantika Putri',
  senderName: 'R',
  recipientTitle: 'My Princess',
  whatsappNumber: '',
  letterText: `Selamat Ulang Tahun Cintaakuu, Semoga panjang umur, sehat selalu, and semoga di umur kamu yang sekarang, semua hal hal baik datang satu per satu yaa cintaa.... semoga apa yang kamu impikan akan tercapai satu per satu

Makasih yaa udah hadir di dunia ini. Aku seneng banget, bisa kenal sama kamu. Semoga senyum manis kamu nggak pernah hilang, dan semoga aku bisa terus jadi salah satu alasan di balik senyum itu.

Once again, happy birthday, my favorite girl. I hope your day is as beautiful as you are. 🥹💐💖

I love youu, more than words can say. 💕🌸`,
  photos: [
    'images/foto1.jpg',
    'images/foto2.jpg',
    'images/foto3.jpg'
  ]
};

// Current App State
let appState = {
  currentStep: 1,
  candlesBlown: false,
  isPlayingMusic: false,
  config: { ...DEFAULT_CONFIG }
};

// DOM Elements
const steps = document.querySelectorAll('.step-card');
const heartsContainer = document.getElementById('hearts-container');

// Step 1 & 2 Elements
const giftInteractive = document.getElementById('gift-box-interactive');
const btnOpenGift = document.getElementById('btn-open-gift');
const btnToLetter = document.getElementById('btn-to-letter');

// Step 3 Elements
const envelopeSealed = document.getElementById('envelope-sealed-container');
const letterOpened = document.getElementById('letter-content-container');
const btnOpenEnvelope = document.getElementById('btn-open-envelope');
const btnToGallery = document.getElementById('btn-to-gallery');

// Step 4 Elements
const btnToCake = document.getElementById('btn-to-cake');
const likeButtons = document.querySelectorAll('.photo-like-btn');

// Step 5 Elements
const btnBlowCandle = document.getElementById('btn-blow-candle');
const blowActionContainer = document.getElementById('blow-action-container');
const afterBlowContainer = document.getElementById('after-blow-container');
const btnToFinal = document.getElementById('btn-to-final');
const candles = document.querySelectorAll('.candle');

// Step 6 Elements
const btnReplay = document.getElementById('btn-replay-journey');
const btnWhatsapp = document.getElementById('btn-whatsapp-reply');

// Music & Config Modal
const musicToggleBtn = document.getElementById('music-toggle-btn');
const editConfigBtn = document.getElementById('edit-config-btn');
const configModal = document.getElementById('config-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnSaveConfig = document.getElementById('btn-save-config');
const btnResetDefault = document.getElementById('btn-reset-default');

const inputRecipient = document.getElementById('input-recipient');
const inputSender = document.getElementById('input-sender');
const inputWa = document.getElementById('input-wa');
const inputLetter = document.getElementById('input-letter');

/* ========================================================
   LOCAL STORAGE & DATA BINDING
   ======================================================== */
function loadSavedConfig() {
  const saved = localStorage.getItem('birthday_app_config');
  if (saved) {
    try {
      appState.config = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Gagal memuat config tersimpan:', e);
    }
  }
  applyConfigToDOM();
}

function applyConfigToDOM() {
  // Update Recipient Names
  document.querySelectorAll('.recipient-name').forEach(el => {
    el.textContent = appState.config.recipientName;
  });

  // Update Sender Names
  document.querySelectorAll('.sender-name').forEach(el => {
    el.textContent = appState.config.senderName;
  });

  // Update Cake Tag
  const cakeTag = document.querySelector('.cake-recipient-tag');
  if (cakeTag) {
    cakeTag.textContent = (appState.config.recipientTitle || 'MY PRINCESS').toUpperCase();
  }

  // Update Letter Body
  const letterRender = document.getElementById('letter-text-rendered');
  if (letterRender) {
    const paragraphs = appState.config.letterText.split('\n\n').filter(p => p.trim().length > 0);
    letterRender.innerHTML = paragraphs.map(p => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('');
  }

  // Update WhatsApp Link
  if (btnWhatsapp) {
    const defaultMsg = `Makasih banyak yaa sayang buat kejutannya! Aku suka banget sama webnya 🥹💐💖`;
    const phone = (appState.config.whatsappNumber || '').replace(/[^0-9]/g, '');
    const baseUrl = phone ? `https://wa.me/${phone}` : `https://wa.me/`;
    btnWhatsapp.href = `${baseUrl}?text=${encodeURIComponent(defaultMsg)}`;
  }

  // Sync inputs
  if (inputRecipient) inputRecipient.value = appState.config.recipientName;
  if (inputSender) inputSender.value = appState.config.senderName;
  if (inputWa) inputWa.value = appState.config.whatsappNumber;
  if (inputLetter) inputLetter.value = appState.config.letterText;

  // Update Photos
  if (appState.config.photos && appState.config.photos.length) {
    appState.config.photos.forEach((src, idx) => {
      const img = document.getElementById(`img-slot-${idx + 1}`);
      if (img && src) {
        img.src = src;
      }
    });
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ========================================================
   NAVIGATION & STEP TRANSITIONS
   ======================================================== */
function goToStep(stepNumber) {
  appState.currentStep = stepNumber;
  steps.forEach(card => {
    const step = parseInt(card.getAttribute('data-step'), 10);
    if (step === stepNumber) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Auto trigger effects on certain steps
  if (stepNumber === 2) {
    triggerConfettiBurst(2);
  }
}

/* Step 1 -> Step 2 */
function openGiftBox() {
  triggerCelebrationConfetti();
  goToStep(2);
  if (!appState.isPlayingMusic) {
    startMusicBox();
  }
}

if (giftInteractive) giftInteractive.addEventListener('click', openGiftBox);
if (btnOpenGift) btnOpenGift.addEventListener('click', openGiftBox);

/* Step 2 -> Step 3 */
if (btnToLetter) {
  btnToLetter.addEventListener('click', () => {
    // Reset envelope view
    if (envelopeSealed) envelopeSealed.classList.remove('hidden');
    if (letterOpened) letterOpened.classList.add('hidden');
    goToStep(3);
  });
}

/* Step 3: Open Envelope */
if (btnOpenEnvelope) {
  btnOpenEnvelope.addEventListener('click', () => {
    triggerConfettiBurst(1);
    envelopeSealed.classList.add('hidden');
    letterOpened.classList.remove('hidden');
    playHeartChime();
  });
}

if (btnToGallery) {
  btnToGallery.addEventListener('click', () => {
    goToStep(4);
  });
}

/* Step 4: Polaroid Gallery */
likeButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.toggle('liked');
    const heart = btn.querySelector('.heart-symbol');
    if (btn.classList.contains('liked')) {
      heart.textContent = '❤️';
      triggerMiniHeartExplosion(e.clientX, e.clientY);
    } else {
      heart.textContent = '🤍';
    }
  });
});

// Setup Photo Change Trigger by Clicking on the Polaroid Photo
[1, 2, 3].forEach(slotNum => {
  const fileInput = document.getElementById(`file-input-${slotNum}`);
  const polaroidWrapper = fileInput?.parentElement;

  if (polaroidWrapper && fileInput) {
    polaroidWrapper.addEventListener('click', (e) => {
      // Don't trigger if clicked on the like button
      if (e.target.closest('.photo-like-btn')) return;
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        handlePhotoFile(file, slotNum - 1);
      }
    });
  }

  // Also connect modal file pickers
  const modalPicker = document.getElementById(`modal-file-${slotNum}`);
  if (modalPicker) {
    modalPicker.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        handlePhotoFile(file, slotNum - 1);
      }
    });
  }
});

function handlePhotoFile(file, index) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const dataUrl = event.target.result;
    if (!appState.config.photos) {
      appState.config.photos = [...DEFAULT_CONFIG.photos];
    }
    appState.config.photos[index] = dataUrl;

    // Save to localStorage
    try {
      localStorage.setItem('birthday_app_config', JSON.stringify(appState.config));
    } catch (err) {
      console.warn('Storage limit reached, photo kept in memory:', err);
    }

    // Update DOM
    const img = document.getElementById(`img-slot-${index + 1}`);
    if (img) {
      img.src = dataUrl;
    }
    triggerConfettiBurst(1);
  };
  reader.readAsDataURL(file);
}

if (btnToCake) {
  btnToCake.addEventListener('click', () => {
    resetCandles();
    goToStep(5);
  });
}

/* Step 5: Cake & Candle Blowing */
function resetCandles() {
  appState.candlesBlown = false;
  candles.forEach(candle => candle.classList.remove('blown'));
  if (blowActionContainer) blowActionContainer.classList.remove('hidden');
  if (afterBlowContainer) afterBlowContainer.classList.add('hidden');
}

function blowCandles() {
  if (appState.candlesBlown) return;
  appState.candlesBlown = true;

  candles.forEach((candle, index) => {
    setTimeout(() => {
      candle.classList.add('blown');
    }, index * 140);
  });

  // Sound & Massive Confetti
  playBlowSound();
  setTimeout(() => {
    triggerMassiveCelebration();
    if (blowActionContainer) blowActionContainer.classList.add('hidden');
    if (afterBlowContainer) afterBlowContainer.classList.remove('hidden');
  }, 400);
}

if (btnBlowCandle) btnBlowCandle.addEventListener('click', blowCandles);

if (btnToFinal) {
  btnToFinal.addEventListener('click', () => {
    goToStep(6);
    triggerCelebrationConfetti();
  });
}

/* Step 6: Replay */
if (btnReplay) {
  btnReplay.addEventListener('click', () => {
    resetCandles();
    if (envelopeSealed) envelopeSealed.classList.remove('hidden');
    if (letterOpened) letterOpened.classList.add('hidden');
    goToStep(1);
  });
}

/* ========================================================
   AMBIENT FLOATING HEARTS
   ======================================================== */
function createFloatingHearts() {
  const heartIcons = ['💖', '💕', '💗', '🌸', '✨', '🤍', '🌷'];
  setInterval(() => {
    if (document.hidden) return;
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.style.left = Math.random() * 95 + 'vw';
    heart.style.fontSize = (Math.random() * 16 + 12) + 'px';
    heart.style.animationDuration = (Math.random() * 6 + 7) + 's';
    heart.style.opacity = (Math.random() * 0.4 + 0.3).toString();

    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 13000);
  }, 450);
}

/* ========================================================
   CONFETTI FX (CANVAS CONFETTI)
   ======================================================== */
function triggerConfettiBurst(burstCount = 1) {
  if (typeof confetti !== 'function') return;

  for (let i = 0; i < burstCount; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#ff2a70', '#ff6584', '#ffd152', '#ffffff', '#ff9abb']
      });
    }, i * 200);
  }
}

function triggerCelebrationConfetti() {
  if (typeof confetti !== 'function') return;

  confetti({
    particleCount: 80,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#ff2a70', '#ff4081', '#ffc107', '#ff6584', '#ffffff']
  });
}

function triggerMassiveCelebration() {
  if (typeof confetti !== 'function') return;

  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 45 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 },
      colors: ['#ff2a70', '#ff7597', '#ffd54f', '#a78bfa', '#ffffff']
    }));
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 },
      colors: ['#ff2a70', '#ff7597', '#ffd54f', '#a78bfa', '#ffffff']
    }));
  }, 250);
}

function triggerMiniHeartExplosion(x, y) {
  if (typeof confetti !== 'function') return;
  confetti({
    particleCount: 15,
    spread: 45,
    origin: {
      x: x / window.innerWidth,
      y: y / window.innerHeight
    },
    colors: ['#ff2a70', '#ff6584', '#ffffff']
  });
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

/* ========================================================
   ROMANTIC MUSIC BOX (WEB AUDIO API SYNTHESIZER)
   Zero external dependencies, always plays beautifully
   ======================================================== */
let audioCtx = null;
let musicInterval = null;

const MELODY_NOTES = [
  // Sweet romantic lullaby / music box chord progression
  523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
  587.33, 698.46, 880.00, 1174.66, // D5, F5, A5, D6
  493.88, 659.25, 783.99, 987.77,  // B4, E5, G5, B5
  523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
  698.46, 880.00, 1046.50, 1318.51,// F5, A5, C6, E6
  659.25, 783.99, 987.77, 1174.66, // E5, G5, B5, D6
  587.33, 698.46, 880.00, 1046.50, // D5, F5, A5, C6
  523.25, 659.25, 783.99, 1046.50  // C5, E5, G5, C6
];

function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playMusicBoxBell(freq) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  // Primary sine bell tone
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  // Subtle harmonic overtone for music box sparkle
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq * 2, now);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

  gain2.gain.setValueAtTime(0.05, now);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

  osc.connect(gain);
  osc2.connect(gain2);

  gain.connect(audioCtx.destination);
  gain2.connect(audioCtx.destination);

  osc.start(now);
  osc2.start(now);
  osc.stop(now + 1.7);
  osc2.stop(now + 0.9);
}

function playBlowSound() {
  initAudioContext();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  // Gentle breath noise simulation with lowpass filter
  const bufferSize = audioCtx.sampleRate * 0.4;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(600, now);
  filter.Q.setValueAtTime(1.5, now);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  noise.start(now);
}

function playHeartChime() {
  initAudioContext();
  if (!audioCtx) return;
  playMusicBoxBell(880);
  setTimeout(() => playMusicBoxBell(1046.5), 120);
  setTimeout(() => playMusicBoxBell(1318.5), 240);
}

function startMusicBox() {
  initAudioContext();
  if (appState.isPlayingMusic) return;

  appState.isPlayingMusic = true;
  musicToggleBtn.classList.add('playing');
  musicToggleBtn.querySelector('.music-label').textContent = 'Jeda Musik';

  let noteIdx = 0;
  musicInterval = setInterval(() => {
    if (!appState.isPlayingMusic) return;
    const freq = MELODY_NOTES[noteIdx];
    playMusicBoxBell(freq);
    noteIdx = (noteIdx + 1) % MELODY_NOTES.length;
  }, 420);
}

function stopMusicBox() {
  appState.isPlayingMusic = false;
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  musicToggleBtn.classList.remove('playing');
  musicToggleBtn.querySelector('.music-label').textContent = 'Putar Musik';
}

if (musicToggleBtn) {
  musicToggleBtn.addEventListener('click', () => {
    if (appState.isPlayingMusic) {
      stopMusicBox();
    } else {
      startMusicBox();
    }
  });
}

/* ========================================================
   MODAL CONFIGURATION / EDIT
   ======================================================== */
if (editConfigBtn) {
  editConfigBtn.addEventListener('click', () => {
    configModal.classList.remove('hidden');
  });
}

if (btnCloseModal) {
  btnCloseModal.addEventListener('click', () => {
    configModal.classList.add('hidden');
  });
}

configModal.addEventListener('click', (e) => {
  if (e.target === configModal) {
    configModal.classList.add('hidden');
  }
});

if (btnSaveConfig) {
  btnSaveConfig.addEventListener('click', () => {
    appState.config.recipientName = inputRecipient.value.trim() || DEFAULT_CONFIG.recipientName;
    appState.config.senderName = inputSender.value.trim() || DEFAULT_CONFIG.senderName;
    appState.config.whatsappNumber = inputWa.value.trim();
    appState.config.letterText = inputLetter.value.trim() || DEFAULT_CONFIG.letterText;

    localStorage.setItem('birthday_app_config', JSON.stringify(appState.config));
    applyConfigToDOM();
    configModal.classList.add('hidden');
    triggerConfettiBurst(1);
  });
}

if (btnResetDefault) {
  btnResetDefault.addEventListener('click', () => {
    if (confirm('Kembalikan semua nama dan pesan ke pengaturan awal?')) {
      appState.config = { ...DEFAULT_CONFIG };
      localStorage.removeItem('birthday_app_config');
      applyConfigToDOM();
      configModal.classList.add('hidden');
    }
  });
}

/* ========================================================
   INITIALIZATION
   ======================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadSavedConfig();
  createFloatingHearts();

  // First user interaction auto-initializes audio context
  const unlockAudio = () => {
    initAudioContext();
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };
  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);
});
