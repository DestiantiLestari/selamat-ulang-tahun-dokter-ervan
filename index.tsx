/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import confetti from 'canvas-confetti';
import drErvanScrapbookJpg from './src/assets/images/dr_ervan_scrapbook_1781800733989.jpg';
import { 
  Heart, 
  Calendar, 
  Sparkles, 
  Smile, 
  Gift, 
  Volume2, 
  VolumeX, 
  Camera,
  Stethoscope,
  Stars,
  Flower,
  BookOpen,
  Check
} from 'lucide-react';

// Single beautifully crafted poetic letter written from "Me" to dr. Ervan on his birthday June 19
const POETIC_LETTER = `Selamat Hari Lahir, dr. Ervan! 🌸

Matahari bersinar lebih hangat hari ini, bersuka cita merayakan hari lahir sosok berhati mulia sepertimu. 

Kamu telah menjadi pelita bagi banyak jiwa yang mencari kesembuhan, memberikan rasa tenang lewat kata-kata lembut serta sentuhan pengobatan yang penuh dengan ketulusan hati. Di setiap langkahmu terukir kesabaran yang luar biasa, mengubah kecemasan menjadi lentera harapan bagi kesembuhan sesama.

Semoga hidupmu selalu dihiasi tawa riang, dikelilingi orang-orang terkasih yang menyayangimu, dan dilingkupi kesehatan jasmani serta ketenteraman jiwa yang sempurna. Teruslah memancarkan kebaikan dan menjadi berkah indah untuk dunia sekitar.

Nikmati hari istimewa ini dengan sejuta kedamaian dan sukacita yang mekar di dadamu! ✨

Dengan tulus mendoakanmu selalu,
Seseorang yang Mengagumimu 🩺💖`;

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

  // Refs for custom elements
  const scrapbookRef = useRef<HTMLDivElement>(null);

  // Synchronize dynamic updates to loop playback on change of state
  useEffect(() => {
    isAudioPlayingRef.current = audioPlaying;
  }, [audioPlaying]);

  // Handle global click to initialize audio or trigger on any interaction
  useEffect(() => {
    const handleGlobalInteraction = () => {
      if (!isAudioPlayingRef.current) {
        setAudioPlaying(true);
        playMelody();
      }
      // Remove once initialized
      document.removeEventListener('click', handleGlobalInteraction);
      document.removeEventListener('touchstart', handleGlobalInteraction);
    };

    document.addEventListener('click', handleGlobalInteraction);
    document.addEventListener('touchstart', handleGlobalInteraction);

    return () => {
      document.removeEventListener('click', handleGlobalInteraction);
      document.removeEventListener('touchstart', handleGlobalInteraction);
    };
  }, []);

  // Trigger grand entrance confetti on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerConfetti();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Standard interactive confetti triggers
  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 85,
      origin: { y: 0.65 },
      colors: ['#FFB7C5', '#CBDCCB', '#FCF6F0', '#E89BB0', '#8FA89B'],
    });
  };

  const triggerCakeBlowConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.75 },
      colors: ['#FFB7C5', '#CBDCCB', '#FCF6F0', '#FFF0F2'],
    });
  };

  // Web Audio Music Box Pluck Synthesis
  const playMelody = () => {
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

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid double toggle from global container click
    if (audioPlaying) {
      stopAudio();
    } else {
      setAudioPlaying(true);
      setTimeout(() => {
        playMelody();
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-pastel-green-light bg-journal-dots relative font-sans text-stone-700 py-6 px-4 md:py-12 sm:px-6 overflow-x-hidden selection:bg-pastel-green selection:text-white">
      
      {/* Gentle Floating Background Elements (Cute Scrapbook Style - Multi-motion) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        
        {/* Soft Sage Balloon */}
        <motion.div 
          className="absolute left-[4%] top-[10%] text-[4rem] opacity-15 pointer-events-none z-0 hidden lg:block"
          animate={{ 
            y: [0, -30, 0], 
            rotate: [2, 12, -4, 2],
            scale: [1, 1.05, 0.98, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          🎈
        </motion.div>

        {/* Soft Sage Balloon */}
        <motion.div 
          className="absolute right-[6%] top-[20%] text-[4.5rem] opacity-15 pointer-events-none z-0 hidden lg:block"
          animate={{ 
            y: [0, -38, 0], 
            rotate: [-4, -14, 8, -4],
            scale: [1, 0.97, 1.03, 1]
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        >
          🎈
        </motion.div>

        {/* Floating Pastel Heart Left */}
        <motion.div 
          className="absolute left-[2%] bottom-[25%] text-rose-350 opacity-20 text-4xl font-bold pointer-events-none z-0"
          animate={{ 
            y: [0, -22, 0], 
            scale: [1, 1.15, 0.9, 1],
            rotate: [0, 15, -15, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          💖
        </motion.div>

        {/* Floating Pastel Heart Right */}
        <motion.div 
          className="absolute right-[2%] bottom-[15%] text-rose-350 opacity-20 text-5xl pointer-events-none z-0"
          animate={{ 
            y: [0, -28, 0], 
            scale: [1, 1.08, 0.95, 1.08, 1],
            rotate: [5, -10, 10, 5]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          💝
        </motion.div>

        {/* Floating Big Daisy Flower */}
        <motion.div 
          className="absolute left-[38%] top-[2%] text-pink-350 opacity-15 text-5xl pointer-events-none z-0 hidden md:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          🌸
        </motion.div>

        {/* Floating Little Yellow Flower */}
        <motion.div 
          className="absolute right-[40%] bottom-[6%] text-amber-300 opacity-20 text-4xl pointer-events-none z-0 hidden md:block"
          animate={{ 
            rotate: -360,
            y: [0, -15, 0]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          🌼
        </motion.div>

        {/* Tiny stars swaying around */}
        <motion.div 
          className="absolute left-[15%] top-[45%] text-amber-400 opacity-30 text-3xl"
          animate={{ scale: [0.8, 1.3, 0.8], rotate: 45 }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ✨
        </motion.div>

        <motion.div 
          className="absolute right-[18%] top-[60%] text-amber-400 opacity-30 text-4xl"
          animate={{ scale: [1.3, 0.8, 1.3], rotate: -45 }}
          transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
        >
          ✨
        </motion.div>

      </div>

      {/* Main Single Page Frame container */}
      <div className="max-w-6xl mx-auto relative z-10">

        {/* --- AUDIO MUSIC BOX PLAYER (Sticker-Style Record Widget) --- */}
        <div id="audio-widget-container" className="fixed top-4 right-4 z-50">
          <motion.button
            id="audio-toggle-button"
            onClick={toggleMusic}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-white bg-opacity-90 backdrop-blur-md px-4 py-3 rounded-full shadow-md border border-pastel-green text-sm font-semibold hover:bg-pastel-cream text-stone-700 transition-colors"
          >
            <motion.div
              animate={audioPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className={`p-1.5 rounded-full ${audioPlaying ? 'bg-pastel-green-dark text-white' : 'bg-pastel-green text-stone-800'}`}
            >
              <MusicBoxDiscIcon active={audioPlaying} />
            </motion.div>
            <span className="pr-1 text-xs">
              {audioPlaying ? "Mute Musik Box 🎵" : "Putar Musik Box 📻"}
            </span>
            {audioPlaying ? (
              <Volume2 className="w-4 h-4 text-pastel-green-dark animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </motion.button>
        </div>

        {/* Interactive sound notification toast banner */}
        <div className="text-center mb-3 -mt-4">
          <span className="text-[10px] bg-white bg-opacity-95 px-3 py-1.5 rounded-full border border-pastel-green-light font-mono text-pastel-green-dark font-bold shadow-xs animate-bounce inline-block">
            ✨ Ketuk layar di mana saja untuk menyalakan lagu otomatis! 🎵
          </span>
        </div>

        {/* --- HIGH-CRAFT HEADER RIBBON (CLEAN - NO ARABIC) --- */}
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
              className="bg-white/85 backdrop-blur-md px-10 py-7 rounded-[2rem] shadow-sm border border-pastel-green-light relative overflow-hidden"
            >
              
              {/* Corner Gentle Swaying Flowers */}
              <motion.div 
                className="absolute -left-2 -top-2 text-xl select-none"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🍀
              </motion.div>
              <motion.div 
                className="absolute -right-2 -top-2 text-xl select-none"
                animate={{ rotate: [0, -20, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                🌿
              </motion.div>
              <div className="absolute -bottom-2 -left-2 text-xl opacity-60 select-none">🍀</div>
              <div className="absolute -bottom-2 -right-2 text-xl opacity-60 select-none">🌿</div>

              <h4 className="font-serif italic text-pastel-green-dark text-xl sm:text-2xl md:text-3xl font-extrabold mb-2.5">
                Hari Istimewa • Doa Terbaik Sepanjang Masa
              </h4>

              <h1 className="font-serif font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-stone-850 tracking-tight leading-tight mb-4">
                Selamat Ulang Tahun, <br className="sm:hidden" />
                <span className="text-pastel-green-dark italic">dr. Ervan! ✨</span>
              </h1>

              <p className="text-stone-600 font-sans text-sm sm:text-base md:text-lg font-medium tracking-wide max-w-2xl mx-auto leading-relaxed mt-4">
                Platform scrapbook kebahagiaan digital yang kupersembahkan khusus sebagai kado terindah untuk merayakan hari lahir dokter yang paling ramah, hangat, dan penyabar! 👨‍⚕️🩺💖
              </p>
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

              {/* Portrait container image */}
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-white border border-pastel-cream-dark shadow-inner relative group">
                
                <img 
                  src={drErvanScrapbookJpg} 
                  alt="Scrapbook dr. Ervan Illustration" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
                />

                {/* Aesthetic stamp circle marker */}
                <div className="absolute bottom-3 right-3 bg-pastel-green-dark/95 backdrop-blur-xs text-white text-xs py-1.5 px-3 rounded-full font-mono font-bold tracking-wider flex items-center space-x-1.5 shadow-md">
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
                <div className="flex items-center justify-center space-x-1.5 mt-2.5 text-xs sm:text-sm text-stone-500 font-bold font-mono tracking-wider">
                  <Camera className="w-4 h-4 text-pastel-green-dark" />
                  <span>DEDIKASI, KELUHURAN & RAMAH SEJATI</span>
                </div>
              </div>

              {/* Pin Decoration */}
              <div className="absolute -top-3 left-4 text-2xl select-none drop-shadow-sm filter rotate-12">📌</div>
            </motion.div>


            {/* DYNAMIC VIRTUAL BIRTHDAY CAKE */}
            <motion.div 
              id="scr-birthday-cake"
              whileHover={{ y: -2 }}
              className="bg-white p-6 rounded-3xl border border-pastel-green-light shadow-md relative overflow-hidden"
            >
              <div className="absolute -right-16 top-5 bg-pastel-green-dark text-white text-[10px] font-bold py-1 px-16 rotate-45 uppercase tracking-widest text-center shadow-xs">
                TIUP AKU! 🎂
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <div className="p-1.5 bg-emerald-50 rounded-lg text-pastel-green-dark">
                  <Gift className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-black text-lg text-pastel-green-dark">Kue Ulang Tahun Virtual</h3>
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
                      <span className="text-pastel-green-dark">Kue ulang tahun telah ditiup indah! 🥳 (Klik untuk nyalakan kembali)</span>
                    ) : (
                      <span className="text-pastel-green-dark animate-pulse font-bold">✨ Klik kue untuk MENIUP lilin virtual! ✨</span>
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
                  <h3 className="font-serif font-black text-lg text-pastel-green-dark">Momen Kebahagiaan</h3>
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
                        <>
                          {/* Highlighted stamp with heartbeat animations */}
                          <motion.div 
                            className="absolute inset-[1px] stamp-border rounded-full flex items-center justify-center cursor-pointer bg-pastel-green-dark text-white shadow-md border-2 border-white z-10"
                            animate={{ scale: [1, 1.15, 0.95, 1.1, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                            aria-label="Dokter Ervan Birthday Day Highlighted"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerConfetti();
                            }}
                          >
                            <span className="text-xs font-black relative">
                              19
                              <div className="absolute -top-1.5 -right-1.5 text-[8px]">💖</div>
                            </span>
                          </motion.div>
                          
                          <div className="absolute -bottom-2 w-1.5 h-1.5 bg-pastel-green-dark rounded-full animate-ping z-20" />
                        </>
                      ) : (
                        <span className={`p-1.5 w-7 h-7 flex items-center justify-center rounded-lg ${day === 1 || day === 7 || day === 14 || day === 21 || day === 28 ? 'text-rose-400 font-bold' : 'text-stone-500'} hover:bg-stone-50 transition-colors`}>
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

              {/* Aesthetic Calendar Caption */}
              <p className="font-hand text-2xl sm:text-3xl text-pastel-green-dark font-black text-center mt-8 mb-2 leading-relaxed">
                "Hari indah di mana lahirnya sosok baik hati pembawa tawa, berkat, dan sejuta kesembuhan!"
              </p>
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
              className="bg-pastel-cream p-5 pb-6 rounded-2xl polaroid-shadow border border-slate-100 relative select-none max-w-sm sm:max-w-md w-full mx-auto"
            >
              {/* Green washi tape */}
              <div className="absolute -top-3 left-1/4 w-28 h-6 washi-tape-green -rotate-3 z-10 opacity-90 animate-pulse" />
              
              <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-white border border-pastel-cream-dark shadow-inner relative group">
                <img 
                  src={drErvanScrapbookJpg} 
                  alt="dr. Ervan Portrait decoration" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none pointer-events-none transition-all duration-700 filter saturate-100 hue-rotate-15 contrast-105"
                />
                <div className="absolute top-2.5 right-2.5 bg-emerald-700/90 text-white text-xs py-1 px-3 rounded font-mono uppercase font-black tracking-widest shadow-md">
                  SMILE ✨
                </div>
              </div>
              <div className="text-center mt-4">
                <span className="font-hand text-3xl sm:text-4xl text-pastel-green-dark font-black leading-tight">Lentera Kebaikan Pasien 🌟</span>
                <p className="text-xs text-stone-500 font-bold font-mono tracking-wider mt-1.5 uppercase">TERIMA KASIH ATAS KETULUSAN & PENGABDIANMU</p>
              </div>
            </motion.div>


            {/* HIGH-CRAFT PERSONAL LETTER WRITTEN DIRECTLY FROM "ME" ("DARI AKU") */}
            <div id="scrapbook-letter-sheet" className="bg-[#FAFDFB] border border-pastel-green p-6 sm:p-8 rounded-[2rem] shadow-sm relative">
              
              {/* Circular Mini Photo Badge sticker */}
              <div className="absolute top-3.5 right-12 w-16 h-16 rounded-full border-2 border-white bg-white shadow-md p-0.5 overflow-hidden rotate-12 hover:scale-110 transition-transform hidden sm:block z-10">
                <img 
                  src={drErvanScrapbookJpg} 
                  alt="Mini sticker" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Note lined page decoration washi paper */}
              <div className="absolute top-[-10px] left-12 w-20 h-5 washi-tape-green -rotate-3 opacity-90 animate-pulse" />
              <div className="absolute top-1 right-8 pointer-events-none select-none text-2xl animate-float-slow">💌</div>

              {/* Header Letter Meta info */}
              <div className="flex items-center justify-between border-b border-dashed border-stone-200 pb-3 mb-5">
                <div className="flex items-center space-x-1.5 text-xs text-stone-500 font-bold uppercase font-mono tracking-wider">
                  <BookOpen className="w-4 h-4 text-pastel-green-dark" />
                  <span>Surat Puitis Dari Hatiku</span>
                </div>
                <span className="text-[10px] font-mono bg-pastel-green-light text-pastel-green-dark px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Khusus Hari Ini 💕
                </span>
              </div>

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

                {/* Direct red certified beautiful stamp icon */}
                <div className="absolute bottom-[-16px] right-2 transform rotate-12 opacity-80 pointer-events-none select-none bg-rose-50 border-2 border-dashed border-rose-300 text-rose-500 rounded-full w-16 h-16 flex flex-col items-center justify-center text-[10px] font-bold font-serif shadow-xs">
                  <span>TERBAIK</span>
                  <span>100%</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* --- SMALL SCRAPBOOK FOOTER --- */}
        <footer className="text-center mt-12 mb-6">
          <p className="text-xs text-stone-400 font-mono tracking-widest uppercase">
            DIBUAT DENGAN PENUH ADMIRASI & DOA • dr. Ervan Ulang Tahun Ke-2026 🎉
          </p>
          <div className="flex items-center justify-center space-x-2 mt-2 opacity-60">
            <span className="w-2 h-2 bg-rose-300 rounded-full animate-bounce" />
            <span className="w-2.5 h-2.5 bg-pastel-green rounded-full animate-pulse" />
            <span className="w-2 h-2 bg-pastel-cream-dark rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </footer>

      </div>
    </div>
  );
}

// Custom simple vinyl disc SVG record component for aesthetic widget
function MusicBoxDiscIcon({ active }: { active: boolean }) {
  return (
    <svg 
      className={`w-4 h-4 ${active ? 'animate-spin' : ''}`} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

// Render React App
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
