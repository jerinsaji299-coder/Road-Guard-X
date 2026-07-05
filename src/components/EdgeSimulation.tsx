import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Play, Pause, Terminal as TerminalIcon, Activity, MapPin, ShieldCheck } from 'lucide-react';

const EdgeSimulation: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'video/mp4') {
      setVideoFile(file);
      setLogs(prev => [...prev, `[SYSTEM] Loaded video: ${file.name}`, "[SYSTEM] Initializing YOLOv8 Edge Inference..."]);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const lat = (11.01 + Math.random() * 0.01).toFixed(4);
        const lon = (76.95 + Math.random() * 0.01).toFixed(4);
        const conf = (80 + Math.random() * 15).toFixed(0);
        const classes = ['Pothole', 'Longitudinal Crack', 'Transverse Crack'];
        const detectedClass = classes[Math.floor(Math.random() * classes.length)];
        
        const newLog = `[DETECT] ${detectedClass} | Lat: ${lat}, Lon: ${lon} | Conf: ${conf}%`;
        setLogs(prev => [...prev.slice(-100), newLog]);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Area */}
          <div className="cyber-card rounded-3xl overflow-hidden relative aspect-video bg-black/40 flex items-center justify-center border border-white/5 group">
            {!videoFile ? (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full h-full flex flex-col items-center justify-center gap-6 transition-all ${isDragging ? 'bg-cyan-500/10 border-2 border-dashed border-cyan-500' : ''}`}
              >
                <div className="p-6 bg-cyan-500/5 rounded-full border border-cyan-500/20 group-hover:scale-110 transition-transform">
                  <Upload className="w-12 h-12 text-cyan-500" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-white uppercase tracking-tighter mb-2">Drop Dashcam Footage</p>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">MP4 Format Required for Neural Processing</p>
                </div>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef}
                  src={URL.createObjectURL(videoFile)}
                  className="w-full h-full object-cover"
                  onEnded={() => setIsPlaying(false)}
                />
                {/* Simulated Bounding Boxes Overlay */}
                {isPlaying && (
                  <div className="absolute inset-0 pointer-events-none">
                    <motion.div 
                      animate={{ 
                        x: [100, 300, 200, 400], 
                        y: [200, 150, 300, 250],
                        opacity: [0, 1, 1, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute w-32 h-20 border-2 border-cyan-500 bg-cyan-500/10"
                    >
                      <span className="absolute -top-6 left-0 bg-cyan-500 text-black text-[8px] font-black px-2 py-0.5 uppercase">Pothole 0.92</span>
                    </motion.div>
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={togglePlay}
                      className="p-4 bg-cyan-500 rounded-2xl text-black hover:scale-110 transition-transform"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                        <Activity className="w-4 h-4 text-cyan-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">FPS: 32.4</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                        <ShieldCheck className="w-4 h-4 text-cyan-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">YOLOv8-X</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Telemetry Terminal */}
          <div className="cyber-card rounded-3xl p-8 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <TerminalIcon className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Live Telemetry</h3>
                <p className="text-xs font-bold text-white">Edge Node Stream</p>
              </div>
            </div>
            
            <div 
              ref={terminalRef}
              className="flex-1 bg-black/40 rounded-2xl p-6 font-mono text-[10px] overflow-y-auto space-y-2 border border-white/5"
            >
              {logs.length === 0 && (
                <p className="text-slate-700 italic">Waiting for neural link initialization...</p>
              )}
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-cyan-500/30">[{new Date().toLocaleTimeString()}]</span>
                  <span className={log.includes('DETECT') ? 'text-cyan-400 font-bold' : 'text-slate-400'}>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdgeSimulation;
