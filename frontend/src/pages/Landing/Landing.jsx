import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MESH_IMAGES = [
  "#cafe #aesthetic #picture.jpg",
  "#edc #bucketlist.jpg",
  "#nyc #djing #clubbing #lights #party #livemusic #dancing_.jpg",
  "(9) Instagram.jpg",
  "A Foodie’s Paradise_ Discover the Best of Bangkok’s Night Market at Jodd Fairs.jpg",
  "Aventura inolvidable en el Sáhara.jpg",
  "Cute Snowman Holding White Flowers in the Snow (눈 속에서 하얀 꽃다발을 들고 있는 귀여운 눈사람).jpg",
  "Ending the night right_ a pool party with the best people! ⚡️.jpg",
  "Focus on the magic and wonder.jpg",
  "Follow me if you're a Scuba diver ❤️ #scubapro #scubadivingmag #scubadivers #scuba #scubadiving #scubadiverslife.jpg",
  "Picnic💕.jpg",
  "Register - Login.jpg",
  "Skydiving (1).jpg",
  "Taj Mahal.jpg",
  "download (10).jpg",
  "download (12).jpg",
  "download (13).jpg",
  "download (14).jpg",
  "download (15).jpg",
  "download (6).jpg",
  "download (7).jpg",
  "download (8).jpg",
  "download (9).jpg",
  "neemrana, rajasthan🇮🇳.jpg",
  "🫧.jpg"
];

// Helper to add random slight rotations to polaroids
// seeded pseudo-random so they stay in the same place on re-renders
const randomRot = (seed) => (Math.sin(seed) - 0.5) * 20;

const polaroids = MESH_IMAGES.map((img, i) => ({
  id: i,
  imgUrl: `/assets/grid/${img}`,
  rot: randomRot(i * 10),
  x: (Math.sin(i * 1.5) - 0.5) * 50,
  y: (Math.cos(i * 1.5) - 0.5) * 50,
}));

// Container variants for the Exito AI "Boom"
const gridVariants = {
  hidden: { scale: 1.5, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1], // Very smooth decelerating boom curve
      staggerChildren: 0.04
    }
  }
};

const itemVariants = {
  hidden: { y: 200, opacity: 0, scale: 0.8 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 14 }
  }
};

const Landing = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="relative w-full h-[100vh] bg-[#080808] overflow-hidden flex items-center justify-center font-sans tracking-wide">
      {/* Dynamic Background Noise / Metallic Physical Grid Effect (like Image 2) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />
      
      {/* Gradient Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,8,8,0.95)_80%)] z-10 pointer-events-none" />

      {/* Main 5x5 Matrix Grid Wrapper */}
      <motion.div 
        className="relative z-20 grid grid-cols-5 grid-rows-5 gap-8 w-[160vw] md:w-[120vw] lg:w-[130vw] h-[160vh] md:h-[130vh] -top-10"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {polaroids.map((pic) => {
          const isHovered = hoveredId === pic.id;
          const isAnyHovered = hoveredId !== null;
          
          return (
            <motion.div
              key={pic.id}
              variants={itemVariants}
              onHoverStart={() => setHoveredId(pic.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="relative cursor-pointer group flex items-center justify-center w-full h-full"
              animate={{
                scale: isHovered ? 1.6 : (isAnyHovered ? 0.85 : 1),
                opacity: isHovered ? 1 : (isAnyHovered ? 0.3 : 0.8),
                rotateZ: isHovered ? 0 : pic.rot,
                x: isHovered ? 0 : pic.x,
                y: isHovered ? 0 : pic.y,
                zIndex: isHovered ? 50 : 1,
                filter: isHovered ? "blur(0px) brightness(1.2) drop-shadow(0 25px 25px rgba(0,0,0,0.8))" : (isAnyHovered ? "blur(8px) brightness(0.3)" : "blur(0px) brightness(0.9) drop-shadow(0 10px 10px rgba(0,0,0,0.5))"),
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Polaroid Frame */}
              <div className="relative p-2 pb-12 bg-[#eeeeee] rounded-[4px] w-[80%] h-full max-h-[#400px] flex object-cover shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                
                {/* The Wooden/Metal Clip overlay at top center (Image 2 aesthetic) */}
                <div className="absolute -top-[15px] left-1/2 -translate-x-1/2 w-10 h-7 bg-[#bfa17d] shadow-lg border-b-[2px] border-[#8a7256] rounded-t-[4px] z-10 flex items-center justify-center">
                  {/* Clip opening hole/shadow */}
                  <div className="w-5 h-2 bg-black/40 rounded-full" />
                </div>
                
                {/* Actual Image */}
                <div className="w-full h-full overflow-hidden bg-[#222] rounded-[2px]">
                  <img 
                    src={pic.imgUrl} 
                    alt="Travel Memory"
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                  />
                </div>
              </div>

            </motion.div>
          )
        })}
      </motion.div>

      {/* Hero Welcome Text Box on top */}
      <div className={`absolute z-30 inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 ease-in-out ${hoveredId !== null ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
        <div className="pointer-events-auto text-center backdrop-blur-xl bg-black/30 p-12 rounded-3xl border border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col items-center max-w-[600px]">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 text-6xl md:text-8xl font-black tracking-tighter mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            DIARY.
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light max-w-md mx-auto mb-10 leading-relaxed">
            Every "picture_tells a story. Breathe life into your travel memories on this canvas.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="px-10 py-5 bg-white text-black font-extrabold uppercase tracking-[0.2em] text-sm rounded-full hover:scale-110 hover:bg-cyan-400 hover:text-white hover:shadow-[0_0_40px_rgba(5,182,211,0.6)] transition-all duration-300"
          >
            Open Journal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
