import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface GoalOverlayProps {
  isVisible: boolean;
  playerName?: string;
  playerPhoto?: string;
  teamColor?: string;
  onComplete: () => void;
}

export default function GoalOverlay({
  isVisible,
  playerName,
  playerPhoto,
  teamColor = "#0072ff",
  onComplete,
}: GoalOverlayProps) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onComplete, 500);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#050505]/95"
          id="goal-overlay-container"
        >
          {/* Geometric Background Slashes */}
          <motion.div
            initial={{ x: "-100%", skewX: -20, rotate: -10 }}
            animate={{ x: "-10%", skewX: -20, rotate: -10 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="absolute w-[150%] h-[420px] bg-[#050505] border-y-2 border-[#00f2fe] z-0"
          />
          <motion.div
            initial={{ x: "100%", skewX: -20, rotate: -10 }}
            animate={{ x: "-5%", skewX: -20, rotate: -10 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.8, ease: "circOut", delay: 0.1 }}
            className="absolute w-[140%] h-[400px] bg-gradient-to-r from-[#0072ff] to-[#00f2fe] shadow-[0_0_100px_rgba(0,114,255,0.4)] z-10"
          />

          {/* Main Content Wrapper */}
          <div className="relative z-20 flex items-center w-full max-w-5xl h-[400px]">
            {/* Team Tab Accent */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-32 bg-[#00f2fe] shadow-[0_0_20px_#00f2fe]" />

            {/* Player Visual Section */}
            <div className="flex-1 flex items-end justify-center h-full">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative w-80 h-[440px] bg-[#222] border-4 border-white overflow-hidden flex items-center justify-center"
              >
                {playerPhoto ? (
                  <img
                    src={playerPhoto}
                    alt={playerName}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-white/30 text-sm tracking-[4px]">PHOTO</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </motion.div>
            </div>

            {/* Typographic Section */}
            <div className="flex-[1.5] pl-10 flex flex-col justify-center">
              <motion.h1
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.3 }}
                className="text-[140px] font-black italic text-white uppercase tracking-[-6px] leading-[0.8] drop-shadow-[8px_8px_0px_#050505]"
              >
                GOOOOOAL!
              </motion.h1>
              
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-2 origin-left"
              >
                <div className="bg-white px-5 py-1 inline-block -skew-x-[15deg]">
                  <h2 className="text-5xl font-bold text-[#050505] uppercase skew-x-[15deg]">
                    {playerName || "STRIKER"}
                  </h2>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.8 }}
                className="mt-4 text-lg font-semibold text-white uppercase tracking-[4px]"
              >
                STRIKER • NO. 09
              </motion.p>
            </div>
          </div>

          {/* Decorative Particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[25%] left-[30%] w-1 h-1 bg-white rounded-full opacity-50" />
            <div className="absolute top-[70%] left-[35%] w-1 h-1 bg-white rounded-full opacity-50" />
            <div className="absolute top-[40%] left-[80%] w-1 h-1 bg-white rounded-full opacity-50" />
            <div className="absolute top-[20%] left-[75%] w-[2px] h-24 bg-gradient-to-b from-transparent via-white to-transparent opacity-50" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
