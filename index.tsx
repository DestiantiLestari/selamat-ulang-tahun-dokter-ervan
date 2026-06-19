/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import confetti from 'canvas-confetti';
import drErvanScrapbookJpg from './src/assets/images/dr_ervan_scrapbook_1781800733989.jpg';
import drErvanPortraitJpg from './src/assets/images/ervan.jpeg';
import drErvanTravelJpg from './src/assets/images/dokter.jpg';
import { 
  Heart, 
  Calendar, 
  Sparkles, 
  Smile, 
  Gift, 
  Camera,
  Stethoscope,
  Stars,
  Flower,
  BookOpen,
  Check
} from 'lucide-react';

// Single beautifully crafted letter written to dr. Ervan on his birthday June 19
const POETIC_LETTER = `Selamat bertambah usia, dokter Ervan.

Terima kasih sudah sampai di titik ini dengan semua kesibukan dan tanggung jawab yang pasti tidak sedikit. Di balik hari-hari yang padat, pasti banyak hal kecil yang sudah dilewati dan banyak usaha yang tidak selalu terlihat orang lain.

Ke depan, hari-harinya diisi dengan hal yang lebih lancar, pekerjaan yang tetap berjalan baik, dan juga waktu yang cukup untuk istirahat di tengah kesibukan. Semoga semuanya berjalan baik seperti yang diharapkan.

Jangan lupa istirahat ya dok.`;

// Happy Birthday Melody in Frequencies for our custom Music Box Synth
const HPB_MELODY = [
  { note: 'C4', freq: 261.63, dur: 0.4 },
  { note: 'C4', freq: 261.63, dur: 0.4 },
  { note: 'D4', freq: 293.66, dur: 0.8 },
  { note: 'C4', freq: 261.63, dur: 0.8 },
  { note: 'F4', freq: 349.23, dur: 0.8 },
  { note: 'E4', freq: 329.63, dur: 1.6 },

  { note: 'C4', freq: 261.63, dur: 0.4 },
  { note: 'C4', freq: 261.63, dur: 0.4 },
  { note: 'D4', freq: 293.66, dur: 0.8 },
  { note: 'C4', freq: 261.63, dur: 0.8 },
  { note: 'G4', freq: 392.00, dur: 0.8 },
  { note: 'F4', freq: 349.23, dur: 1.6 },

  { note: 'C4', freq: 261.63, dur: 0.4 },
  { note: 'C4', freq: 261.63, dur: 0.4 },
  { note: 'C5', freq: 523.25, dur: 0.8 },
  { note: 'A4', freq: 440.00, dur: 0.8 },
  { note: 'F4', freq: 349.23, dur: 0.8 },
  { note: 'E4', freq: 329.63, dur: 0.8 },
  { note: 'D4', freq: 293.66, dur: 1.2 },

  { note: 'Bb4', freq: 466.16, dur: 0.4 },
  { note: 'Bb4', freq: 466.16, dur: 0.4 },
  { note: 'A4', freq: 440.00, dur: 0.8 },
  { note: 'F4', freq: 349.23, dur: 0.8 },
  { note: 'G4', freq: 392.00, dur: 0.8 },
  { note: 'F4', freq: 349.23, dur: 1.6 },
];

function App() {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  
  // Custom checklist states for sweet wishes
  const [wishesCheck, setWishesCheck] = useState({
    sehat: true,
    bahagia: true,
    karir: true,
    senyum: true
  });

  // Audio Synths references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playLoopTimeoutRef = useRef<number | null>(null);
  const synthNodesRef = useRef<any[]>([]);
  const isAudioPlayingRef = useRef(false);

  // Dedicated Canvas and confetti references
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiInstanceRef = useRef<any>(null);

  // Refs for custom elements
  const scrapbookRef = useRef<HTMLDivElement>(null);

  // Synchronize dynamic updates to loop playback on change of state
  useEffect(() => {
    isAudioPlayingRef.current = audioPlaying;
  }, [audioPlaying]);

  // Handle global click to initialize audio or trigger on any interaction
  useEffect(() => {
    // Attempt automatic play immediately in case browser configuration permits
    try {
      setAudioPlaying(true);
      playMelody();
    } catch (e) {
      console.log('Autoplay deferred until guest interaction');
    }

    const handleGlobalInteraction = () => {
      setAudioPlaying(true);
      
      let needsRestart = false;
      if (audioCtxRef.current) {
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().catch((err) => console.log('Error resuming context', err));
          needsRestart = true;
        }
      } else {
        needsRestart = true;
      }
      
      playMelody(needsRestart);

      // Remove listeners once safely activated
      const events = ['click', 'touchstart', 'pointerdown', 'pointermove', 'scroll', 'keydown'];
      events.forEach((evt) => {
        document.removeEventListener(evt, handleGlobalInteraction);
      });
    };

    const events = ['click', 'touchstart', 'pointerdown', 'pointermove', 'scroll', 'keydown'];
    events.forEach((evt) => {
      document.addEventListener(evt, handleGlobalInteraction, { passive: true });
    });

    return () => {
      events.forEach((evt) => {
        document.removeEventListener(evt, handleGlobalInteraction);
      });
    };
  }, []);

  // Trigger grand entrance confetti on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerConfetti();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Standard interactive confetti triggers with safe fallback
  const triggerConfetti = () => {
    try {
      if (!confettiInstanceRef.current && canvasRef.current) {
        confettiInstanceRef.current = confetti.create(canvasRef.current, {
          resize: true,
          useWorkers: true,
        });
      }
      if (confettiInstanceRef.current) {
        confettiInstanceRef.current({
          particleCount: 150,
          spread: 85,
          origin: { y: 0.65 },
          colors: ['#FFB7C5', '#CBDCCB', '#FCF6F0', '#E89BB0', '#8FA89B'],
        });
      }
    } catch (e) {
      console.warn("Confetti invocation error", e);
      try {
        confetti({
          particleCount: 150,
          spread: 85,
          origin: { y: 0.65 },
          colors: ['#FFB7C5', '#CBDCCB', '#FCF6F0', '#E89BB0', '#8FA89B'],
        });
      } catch (err) {}
    }
  };

  const triggerCakeBlowConfetti = () => {
    try {
      if (!confettiInstanceRef.current && canvasRef.current) {
        confettiInstanceRef.current = confetti.create(canvasRef.current, {
          resize: true,
          useWorkers: true,
        });
      }
      if (confettiInstanceRef.current) {
        confettiInstanceRef.current({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.75 },
          colors: ['#FFB7C5', '#CBDCCB', '#FCF6F0', '#FFF0F2'],
        });
      }
    } catch (e) {
      console.warn("Cake confetti invocation error", e);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.75 },
          colors: ['#FFB7C5', '#CBDCCB', '#FCF6F0', '#FFF0F2'],
        });
      } catch (err) {}
    }
  };

  // Web Audio Music Box Pluck Synthesis
  const playMelody = (forceRestart = false) => {
    // If already scheduled and we don't force a restart, make sure to resume and exit early to prevent double audio overlaps
    if (playLoopTimeoutRef.current && !forceRestart) {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch((err) => console.log('Audio resume error', err));
      }
      return;
    }

    // Stop and clear any existing timeout if we are restarting
    if (playLoopTimeoutRef.current && forceRestart) {
      clearTimeout(playLoopTimeoutRef.current);
      playLoopTimeoutRef.current = null;
    }

    // Safeguard connection cleanup
    try {
      synthNodesRef.current.forEach((node) => {
        try { node.disconnect(); } catch (e) {}
      });
      synthNodesRef.current = [];
    } catch (e) {}

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch((err) => console.log('Audio resume error', err));
    }

    let absoluteTime = ctx.currentTime + 0.1;
    
    // Play the full melody array
    HPB_MELODY.forEach((note) => {
      // Delay effect Nodes
      const delay = ctx.createDelay(1.0);
      const delayGain = ctx.createGain();
      
      delay.delayTime.value = 0.28; // Beautiful echo trail
      delayGain.gain.value = 0.24;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Custom soft music box bell tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, absoluteTime);
      
      const overtoneOsc = ctx.createOscillator();
      const overtoneGain = ctx.createGain();
      overtoneOsc.type = 'triangle';
      overtoneOsc.frequency.setValueAtTime(note.freq * 2, absoluteTime);

      // Envelope Pluck Curve
      gain.gain.setValueAtTime(0, absoluteTime);
      gain.gain.linearRampToValueAtTime(0.24, absoluteTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, absoluteTime + note.dur - 0.05);

      overtoneGain.gain.setValueAtTime(0, absoluteTime);
      overtoneGain.gain.linearRampToValueAtTime(0.04, absoluteTime + 0.01);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, absoluteTime + note.dur * 0.5);

      // Connect nodes
      osc.connect(gain);
      overtoneOsc.connect(overtoneGain);

      gain.connect(ctx.destination);
      overtoneGain.connect(ctx.destination);

      // Connect to Echo Delay loop
      gain.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(ctx.destination);

      osc.start(absoluteTime);
      overtoneOsc.start(absoluteTime);

      const endTime = absoluteTime + note.dur;
      osc.stop(endTime);
      overtoneOsc.stop(endTime);

      // Save references for cleanup
      synthNodesRef.current.push(osc, gain, overtoneOsc, overtoneGain, delay, delayGain);

      // Move forward in schedule timeline (tempo scaler)
      absoluteTime += note.dur * 1.05; 
    });

    // Schedule next loop sequence
    const totalMelodyDurationMs = HPB_MELODY.reduce((sum, item) => sum + item.dur * 1.05, 0) * 1000;
    playLoopTimeoutRef.current = window.setTimeout(() => {
      if (isAudioPlayingRef.current) {
        // Reset the timeout ref value on callback so that the next playMelody execution compiles
        playLoopTimeoutRef.current = null;
        playMelody();
      }
    }, totalMelodyDurationMs);
  };

  const stopAudio = () => {
    if (playLoopTimeoutRef.current) {
      clearTimeout(playLoopTimeoutRef.current);
      playLoopTimeoutRef.current = null;
    }
    try {
      synthNodesRef.current.forEach((node) => {
        try { node.disconnect(); } catch (e) {}
      });
      synthNodesRef.current = [];
    } catch (e) {}
    setAudioPlaying(false);
  };



  return (
    <div className="min-h-screen bg-pastel-green-light bg-journal-dots relative font-sans text-stone-700 py-6 px-4 md:py-12 sm:px-6 overflow-x-hidden selection:bg-pastel-green selection:text-white">
      
      {/* Custom target canvas for canvas-confetti to prevent global window object lookup collisions */}
      <canvas 
        ref={canvasRef} 
        className="pointer-events-none fixed inset-0 w-full h-full z-50"
      />

      {/* Luxurious ambient background decorations (gold leaves, glowing warm light fields, & magical sparkles in empty margins) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Floating golden starry sparkles in margins */}
        <div className="absolute top-[12%] left-[4%] text-2xl lg:text-3xl opacity-35 animate-float select-none">✨</div>
        <div className="absolute top-[28%] right-[3%] text-3xl lg:text-4xl opacity-30 animate-float-slow select-none" style={{ animationDelay: '1.5s' }}>💫</div>
        <div className="absolute top-[48%] left-[2%] text-4xl lg:text-5xl opacity-20 animate-float select-none">🌿</div>
        <div className="absolute top-[68%] right-[2%] text-3xl lg:text-4xl opacity-35 animate-float-slow select-none" style={{ animationDelay: '0.8s' }}>✨</div>
        <div className="absolute top-[82%] left-[3%] text-2xl lg:text-3xl opacity-25 animate-float select-none">🌸</div>
        <div className="absolute top-[18%] right-[5%] text-xl lg:text-2xl opacity-40 animate-float select-none" style={{ animationDelay: '4s' }}>✨</div>
        <div className="absolute bottom-[8%] right-[8%] text-4xl opacity-20 animate-float select-none">💖</div>

        {/* Subtle premium warm gold and soft sage green radial glows to give a high-end luxury feel */}
        <div className="absolute top-[18%] left-[12%] w-[400px] h-[400px] rounded-full bg-amber-200/15 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[22%] right-[8%] w-[500px] h-[500px] rounded-full bg-emerald-100/30 blur-[130px]" />
      </div>

      {/* Main Single Page Frame container */}
      <div className="max-w-6xl mx-auto relative z-10">



        {/* --- HIGH-CRAFT HEADER RIBBON --- */}
        <header id="scrapbook-header" className="text-center mb-10 relative">
          
          <div className="inline-block relative">
            
            {/* Soft Ribbon Washi Tape top */}
            <div className="absolute top-[-22px] left-1/2 -translate-x-1/2 w-32 h-6 washi-tape-green -rotate-2 z-20 flex items-center justify-center">
              <span className="text-[9px] text-pastel-green-dark tracking-wider font-mono font-bold uppercase select-none">19 JUNI 2026</span>
            </div>

            {/* Main Typographical Greeting Card with smooth sliding entrance */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="bg-gradient-to-b from-white to-stone-50/90 backdrop-blur-md px-10 py-8 rounded-[2rem] shadow-md border-2 border-amber-200/50 relative overflow-hidden"
            >
              {/* Luxury Frame Accents in corners */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-300/60 rounded-tl-xl" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-300/60 rounded-tr-xl" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-300/60 rounded-bl-xl" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-300/60 rounded-br-xl" />

              {/* Decorative Subtle Star elements */}
              <div className="absolute top-3 right-12 text-amber-400 opacity-60 animate-bounce text-sm">✦</div>
              <div className="absolute bottom-3 left-12 text-amber-500 opacity-40 animate-pulse text-xs">✦</div>
              
              <h1 className="font-serif font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-stone-850 tracking-tight leading-tight relative z-10">
                Selamat Ulang Tahun, <br className="sm:hidden" />
                <span className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-600 bg-clip-text text-transparent italic">dr. Ervan! ✨</span>
              </h1>
            </motion.div>
          </div>

          <div className="w-40 h-[1px] border-t border-dashed border-pastel-green-dark mx-auto mt-6" />
        </header>


        {/* --- MAIN SCRAPBOOK BOARD CANVAS --- */}
        <div 
          ref={scrapbookRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative p-3 sm:p-6 md:p-8 rounded-[2.5rem] bg-white border border-pastel-cream-dark/60 shadow-xl"
        >
          
          {/* Static tape decorations in corners to hold the page */}
          <div className="absolute -top-3 -left-3 w-28 h-7 washi-tape-green -rotate-12 z-10 opacity-80" />
          <div className="absolute -top-3 -right-3 w-28 h-7 washi-tape -rotate-12 z-10 opacity-80" />
          <div className="absolute -bottom-3 -left-3 w-28 h-7 washi-tape -rotate-12 z-10 opacity-80" />
          <div className="absolute -bottom-3 -right-3 w-28 h-7 washi-tape-green rotate-12 z-10 opacity-80" />

          {/* LEFT SIDE COLUMN (Polaroid Portrait & Cake Area) */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            
            {/* PORTRAIT POLAROID SECTION WITH ACTIVE MOTION */}
            <motion.div 
              id="scr-polaroid-frame"
              animate={{ 
                rotate: [-1.5, 1.5, -1.5],
                y: [0, -6, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="bg-pastel-cream p-5 pb-7 rounded-2xl polaroid-shadow border border-white relative select-none"
            >
              {/* Polaroid top corner tapes */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-6 washi-tape-green rotate-1 z-10 flex items-center justify-center opacity-85">
                <span className="text-[8px] font-mono font-semibold text-pastel-green-dark">DOKTER FAVORIT 🩺❤️</span>
              </div>

              {/* Portrait container image with luxury gold border framing and photo mounts */}
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-white border border-pastel-cream-dark shadow-inner relative group p-2.5 bg-gradient-to-br from-amber-100/40 via-white to-white">
                <div className="w-full h-full rounded-lg overflow-hidden relative">
                  <img 
                    src={drErvanPortraitJpg} 
                    alt="Scrapbook dr. Ervan Illustration" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Real Scrapbook Gold Metallic Photo Mount Corners */}
                  <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-amber-400 rotate-0 rounded-tl-xs" />
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-amber-400 rotate-0 rounded-tr-xs" />
                  <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-amber-400 rotate-0 rounded-bl-xs" />
                  <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-amber-400 rotate-0 rounded-br-xs" />
                </div>

                {/* Aesthetic stamp circle marker */}
                <div className="absolute bottom-4 right-4 bg-pastel-green-dark/95 backdrop-blur-xs text-white text-xs py-1.5 px-3 rounded-full font-mono font-bold tracking-wider flex items-center space-x-1.5 shadow-md">
                  <span>JUNE 19</span>
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                </div>

                {/* Animated sparkly star inside the picture */}
                <motion.div 
                  className="absolute top-3 left-3 text-3xl select-none"
                  animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.div>
              </div>

              {/* Polaroid Handwritten Cursive Footer */}
              <div className="text-center mt-5">
                <h3 className="font-hand text-4xl sm:text-5xl text-pastel-green-dark font-black tracking-wide">
                  dr. Ervan • 19 Juni 2026
                </h3>
              </div>

              {/* Pin Decoration */}
              <div className="absolute -top-3 left-4 text-2xl select-none drop-shadow-sm filter rotate-12">📌</div>
            </motion.div>


            {/* DYNAMIC BIRTHDAY CAKE */}
            <motion.div 
              id="scr-birthday-cake"
              whileHover={{ y: -2 }}
              className="bg-white p-6 rounded-3xl border border-pastel-green-light shadow-md relative overflow-hidden"
            >
              <div className="absolute -right-16 top-5 bg-pastel-green-dark text-white text-[10px] font-bold py-1 px-16 rotate-45 uppercase tracking-widest text-center shadow-xs">
                TIUP LILIN! 🎂
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <div className="p-1.5 bg-emerald-50 rounded-lg text-pastel-green-dark">
                  <Gift className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-black text-lg text-pastel-green-dark">Make a wish</h3>
              </div>

              {/* Interactive Candle Blow Area */}
              <div className="flex flex-col items-center justify-center py-4">
                
                <div 
                  onClick={() => {
                    if (!candlesBlown) {
                      setCandlesBlown(true);
                      triggerCakeBlowConfetti();
                      // Play soft wind sound
                      if (audioCtxRef.current) {
                        const ctx = audioCtxRef.current;
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(800, ctx.currentTime);
                        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.35);
                        gain.gain.setValueAtTime(0.12, ctx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start();
                        osc.stop(ctx.currentTime + 0.4);
                      }
                    } else {
                      setCandlesBlown(false); // Relight
                    }
                  }}
                  className="cursor-pointer group relative flex flex-col items-center select-none"
                >
                  
                  {/* Candle flames with motion */}
                  <div className="flex space-x-8 mb-2 h-10 items-end">
                    {[1, 2, 3].map((candleIndex) => (
                      <div key={candleIndex} className="flex flex-col items-center relative">
                        {!candlesBlown ? (
                          <motion.div 
                            className="bg-amber-400 w-2.5 h-4 rounded-full shadow-inner shadow-amber-200"
                            animate={{ 
                              scale: [1, 1.25, 0.95, 1.15, 1],
                              y: [0, -2, 1, -1, 0]
                            }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: candleIndex * 0.15 }}
                          >
                            <div className="w-1 h-3 bg-red-400 mx-auto rounded-full mt-1.5 opacity-80" />
                          </motion.div>
                        ) : (
                          /* Smoking loops */
                          <motion.div 
                            initial={{ opacity: 0, y: 0, scale: 0.6 }}
                            animate={{ opacity: [0, 0.7, 0], y: -16, scale: 1.2 }}
                            transition={{ duration: 1.8, repeat: Infinity, delay: candleIndex * 0.2 }}
                            className="w-1.5 h-4 border-l border-dashed border-stone-400 rounded-lg text-stone-400"
                          />
                        )}
                        {/* Candle Stick */}
                        <div className={`w-2.5 h-6 ${candleIndex === 1 ? 'bg-indigo-300' : candleIndex === 2 ? 'bg-amber-300' : 'bg-rose-300'} rounded-t-xs border-r border-b border-black/5 shadow-xs`} />
                      </div>
                    ))}
                  </div>

                  {/* Cake layer bodies */}
                  <div className="w-36 h-8 bg-pastel-cream rounded-t-xl border-x border-t border-pastel-cream-dark/40 flex items-center justify-around overflow-hidden shadow-xs relative z-10">
                    <div className="w-full h-2.5 bg-pastel-green-dark absolute top-0" />
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-2.5 h-2.5 bg-emerald-400 rounded-full mt-2" />
                    ))}
                  </div>

                  <div className="w-44 h-12 bg-pastel-green-light rounded-t-lg border border-pastel-green/40 relative flex items-center justify-center shadow-xs">
                    <div className="w-full h-3 bg-white absolute top-0 rounded-b-lg flex justify-around">
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="w-3 h-3.5 bg-white rounded-b-full shadow-xs" />
                      ))}
                    </div>
                    <span className="text-[10px] text-pastel-green-dark font-mono font-bold mt-2 tracking-widest uppercase">HBD ERVAN</span>
                  </div>

                  {/* Cake Stand Panel tray */}
                  <div className="w-52 h-3.5 bg-stone-100 rounded-full border border-stone-200/60 shadow-md translate-y-[-1px]" />
                </div>

                {/* Blow Instruction label */}
                <div className="text-center mt-3">
                  <span className="text-[11px] text-stone-400 font-mono tracking-wider font-semibold">
                    {candlesBlown ? (
                      <span className="text-pastel-green-dark">Semoga semua doa dan harapan terbaik dr. Ervan dikabulkan! 🥳 (Sentuh untuk nyalakan kembali)</span>
                    ) : (
                      <span className="text-pastel-green-dark animate-pulse font-bold">✨ Sentuh kue untuk meniup lilin dan panjatkan doamu! ✨</span>
                    )}
                  </span>
                </div>
              </div>
            </motion.div>

          </div>


          {/* RIGHT SIDE COLUMN (Interactive June 19 Calendar & Personalized Beautiful Letter) */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            
            {/* CUTE SCRAPBOOK CALENDAR WITH SWAY ANIMATIONS */}
            <motion.div 
              id="scr-calendar-widget"
              animate={{ 
                rotate: [1, -1, 1],
                y: [0, -3, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="bg-pastel-cream p-6 rounded-3xl border border-pastel-cream-dark/60 shadow-sm relative overflow-hidden"
            >
              
              {/* Paper Clip Decoration top */}
              <div className="absolute top-1 left-8 w-6 h-10 bg-stone-300 rounded-full border-r border-t border-stone-400 opacity-60 origin-top flex items-center justify-center -rotate-12 select-none pointer-events-none">
                <div className="w-2 h-7 rounded-full border border-stone-400/50" />
              </div>

              <div className="flex items-center justify-between mb-4 pl-12">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-pastel-green-dark" />
                </div>
                <div className="bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-pastel-green text-[10px] font-bold text-pastel-green-dark tracking-wide uppercase font-mono">
                  Juni 2026 🗓️
                </div>
              </div>

               {/* Grid 7 Columns (Days headers) */}
               <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] uppercase font-mono tracking-wider text-stone-400 mb-2 border-b border-stone-200/50 pb-2">
                <span>Min</span>
                <span>Sen</span>
                <span>Sel</span>
                <span>Rab</span>
                <span>Kam</span>
                <span>Jum</span>
                <span>Sab</span>
              </div>

              {/* June 2026 Grid Matrix with day 19 highlighted */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold relative">
                
                {/* Empty Sunday block */}
                <span className="text-stone-300 p-1"></span>

                {/* Days index (1 to 30) */}
                {Array.from({ length: 30 }, (_, index) => {
                  const day = index + 1;
                  const isErvanUlangTahun = day === 19;

                  return (
                    <div 
                      key={day} 
                      className="relative flex items-center justify-center aspect-square"
                    >
                      {isErvanUlangTahun ? (
                        <motion.button 
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerConfetti();
                          }}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer bg-amber-400 text-stone-900 font-black text-sm sm:text-base border-2 border-white shadow-md relative z-20 hover:bg-amber-300 transition-all"
                          aria-label="Dokter Ervan Birthday Day Highlighted"
                        >
                          19
                        </motion.button>
                      ) : (
                        <span className={`p-1.5 w-7 h-7 flex items-center justify-center rounded-lg ${day === 1 || day === 7 || day === 14 || day === 21 || day === 28 ? 'text-rose-500 font-extrabold' : 'text-stone-600 font-bold'} hover:bg-stone-50 transition-colors`}>
                          {day}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Dedicated non-overlapping Calendar Legend Badge */}
              <div className="mt-8 flex justify-center">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  onClick={() => triggerConfetti()}
                  className="bg-emerald-50/80 border border-pastel-green-dark/60 border-dashed px-4 py-2.5 rounded-xl flex items-center space-x-2.5 shadow-xs cursor-pointer select-none transition-all hover:bg-emerald-100/50"
                >
                  <div className="w-6 h-6 rounded-full stamp-border flex items-center justify-center bg-pastel-green-dark text-white text-[10px] sm:text-xs font-black shadow-xs">
                    19
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-pastel-green-dark uppercase tracking-wider">
                    Hari Lahir dr. Ervan! 🎉🎂🩺
                  </span>
                </motion.div>
              </div>


            </motion.div>


            {/* SECOND POLAROID PHOTO - SPREAD TO OTHER PORTION OF THE BOARD */}
            <motion.div
              id="scr-second-photo-frame"
              whileHover={{ scale: 1.02, rotate: -1.5 }}
              animate={{
                y: [0, -4, 0],
                rotate: [1, 2, 1]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="bg-pastel-cream p-5 pb-6 rounded-2xl polaroid-shadow border border-slate-100 relative select-none max-w-sm sm:max-w-md w-full mx-auto animate-float-slow"
            >
              {/* Green washi tape */}
              <div className="absolute -top-3 left-1/4 w-28 h-6 washi-tape-green -rotate-3 z-10 opacity-90 animate-pulse" />
              
              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-white border border-pastel-cream-dark shadow-inner relative group p-2 bg-gradient-to-br from-amber-100/40 via-white to-white">
                <div className="w-full h-full rounded-md overflow-hidden relative">
                  <img 
                    src={drErvanTravelJpg} 
                    alt="dr. Ervan Portrait decoration" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none pointer-events-none transition-all duration-700 filter saturate-100 hue-rotate-15 contrast-105"
                  />
                  {/* Real Scrapbook Gold Metallic Photo Mount Corners */}
                  <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-amber-400 rotate-0 rounded-tl-xs" />
                  <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-amber-400 rotate-0 rounded-tr-xs" />
                  <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-amber-400 rotate-0 rounded-bl-xs" />
                  <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-amber-400 rotate-0 rounded-br-xs" />
                </div>
                <div className="absolute top-3.5 right-3.5 bg-emerald-700/90 text-white text-xs py-1 px-3 rounded font-mono uppercase font-black tracking-widest shadow-md z-10">
                  SMILE ✨
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-xs text-stone-500 font-bold font-mono tracking-wider mt-1.5 uppercase">TERIMA KASIH ATAS KETULUSAN & PENGABDIANMU</p>
              </div>
            </motion.div>


            {/* HIGH-CRAFT PERSONAL LETTER WRITTEN DIRECTLY FROM "ME" ("DARI AKU") */}
            <div id="scrapbook-letter-sheet" className="bg-[#FAFDFB] border border-pastel-green p-6 sm:p-8 rounded-[2rem] shadow-sm relative">

              {/* Note lined page decoration washi paper */}
              <div className="absolute top-[-10px] left-12 w-20 h-5 washi-tape-green -rotate-3 opacity-90 animate-pulse" />
              <div className="absolute top-1 right-8 pointer-events-none select-none text-2xl animate-float-slow">💌</div>

              {/* WRITTEN POETIC LETTER IN LINED SCRAPBOOK CONTAINER */}
              <div className="relative mb-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="font-sans text-base sm:text-lg lg:text-xl text-stone-800 tracking-wide whitespace-pre-wrap bg-journal-lines px-1.5 pb-4 leading-[40px] font-bold"
                  style={{ textShadow: '0 0 1px rgba(255,255,255,0.8)' }}
                >
                  {POETIC_LETTER}
                </motion.div>
              </div>

            </div>

          </div>

        </div>

        {/* --- SMALL SCRAPBOOK FOOTER --- */}
        <footer className="text-center mt-12 mb-6">
          <div className="flex items-center justify-center space-x-2 mt-3 opacity-60">
            <span className="w-1.5 h-1.5 bg-rose-450 rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-pastel-green-dark rounded-full animate-pulse" />
            <span className="w-1.5 h-1.5 bg-pastel-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </footer>

      </div>
    </div>
  );
}



// Render React App
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
