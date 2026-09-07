import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Database, Zap, Clock, Code2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function Landing({ onEnter }: { onEnter: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.4, 0.5], [0, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.2, 0.4, 0.5], [100, 0, -100]);

  const opacity3 = useTransform(scrollYProgress, [0.4, 0.6, 0.7], [0, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.4, 0.6, 0.7], [100, 0, -100]);
  
  const opacity4 = useTransform(scrollYProgress, [0.6, 0.8, 1], [0, 1, 1]);
  const y4 = useTransform(scrollYProgress, [0.6, 0.8, 1], [100, 0, 0]);

  return (
    <div ref={containerRef} className="h-[400vh] bg-[#0A0A0C] text-[#E2E8F0] relative font-sans">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        <motion.div style={{ opacity: opacity1, y: y1 }} className="absolute text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sm font-medium tracking-wide text-zinc-300">Milestone 1 Preview</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 drop-shadow-2xl">
            ReplayDB
          </h1>
          <p className="mt-8 text-2xl md:text-3xl font-light text-zinc-400 max-w-2xl mx-auto">
            Your database has a history.<br/>Now you can explore it.
          </p>
          <div className="mt-12 h-32 w-[1px] bg-gradient-to-b from-white/20 to-transparent mx-auto"></div>
        </motion.div>

        <motion.div style={{ opacity: opacity2, y: y2 }} className="absolute text-center max-w-4xl mx-auto px-6">
          <Database className="w-20 h-20 mx-auto text-blue-500 mb-8 opacity-80" />
          <h2 className="text-5xl font-bold mb-6">Every query creates a state transition.</h2>
          <p className="text-xl text-zinc-400 leading-relaxed">
            Traditional databases only show you the current state. They overwrite history with every UPDATE and DELETE. What if you could see exactly what changed, and when?
          </p>
        </motion.div>

        <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute text-center max-w-4xl mx-auto px-6">
          <Clock className="w-20 h-20 mx-auto text-purple-500 mb-8 opacity-80" />
          <h2 className="text-5xl font-bold mb-6">ReplayDB records those transitions.</h2>
          <p className="text-xl text-zinc-400 leading-relaxed">
            Every transaction is logged in an immutable Write-Ahead Log. We turn your data into a continuous event stream, allowing you to debug complex state changes effortlessly.
          </p>
        </motion.div>

        <motion.div style={{ opacity: opacity4, y: y4 }} className="absolute text-center max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
              <Code2 className="w-8 h-8 mb-4 text-emerald-400" />
              <h3 className="text-lg font-bold mb-2 text-left">SQL Interface</h3>
              <p className="text-sm text-zinc-400 text-left">Execute standard SQL queries against a live in-memory engine.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
              <Zap className="w-8 h-8 mb-4 text-amber-400" />
              <h3 className="text-lg font-bold mb-2 text-left">Event Stream</h3>
              <p className="text-sm text-zinc-400 text-left">Watch your WAL generate real-time events for every row mutation.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
              <Clock className="w-8 h-8 mb-4 text-blue-400" />
              <h3 className="text-lg font-bold mb-2 text-left">Visual Timeline</h3>
              <p className="text-sm text-zinc-400 text-left">Scrub through transaction history in an immersive UI.</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-10">Explore the state of your database.</h2>
          
          <button 
            onClick={onEnter}
            className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-200 to-emerald-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative flex items-center gap-2">
              Launch Developer Console
            </span>
          </button>
        </motion.div>
        
      </div>
    </div>
  );
}
