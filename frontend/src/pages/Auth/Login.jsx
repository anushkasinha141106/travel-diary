import React, { useEffect, useState } from "react"
import PasswordInput from "../../components/PasswordInput"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { validateEmail } from "../../utils/helper"
import { useDispatch, useSelector } from "react-redux"
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/slice/userSlice"
import { motion } from "framer-motion"

const MESH_IMAGES = [
  "picture_1.jpg", "picture_2.jpg", "picture_3.jpg", "picture_4.jpg", "picture_5.jpg",
  "picture_6.jpg", "picture_7.jpg", "picture_8.jpg", "picture_9.jpg", "picture_10.jpg",
  "picture_11.jpg", "picture_12.jpg", "picture_13.jpg", "picture_14.jpg", "picture_15.jpg"
];

// Seeded random rotations
const randomRot = (seed) => (Math.sin(seed) - 0.5) * 20;

const polaroids = MESH_IMAGES.map((img, i) => ({
  id: i,
  imgUrl: `/assets/grid/${encodeURIComponent(img)}`,
  rot: randomRot(i * 20),
  x: (Math.sin(i * 1.5) - 0.5) * 40,
  y: (Math.cos(i * 1.5) - 0.5) * 40,
}));

// Beige Mesh Background Entry Animation
const gridVariants = {
  hidden: { scale: 1.2, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { y: 150, opacity: 0, scale: 0.8 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 80, damping: 14 } }
};

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [hoveredId, setHoveredId] = useState(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { loading, currentUser } = useSelector((state) => state.user)

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Login form submit clicked!")

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }

    if (!password) {
      setError("Please enter your password.")
      return
    }

    setError(null)

    try {
      dispatch(signInStart())

      const response = await axiosInstance.post("/auth/signin", {
        email,
        password,
      })

      if (response.data) {
        dispatch(signInSuccess(response.data))
        navigate("/")
      } else {
        dispatch(signInFailure("An unexpected error occurred!"))
      }
    } catch (error) {
      dispatch(signInFailure("An unexpected error occurred!"))

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    }
  }

  useEffect(() => {
    if (!loading && currentUser) {
      navigate("/")
    }
  }, [currentUser, loading, navigate])

  return (
    <div className="relative w-full h-screen bg-[#ebe7e0] overflow-hidden flex items-center justify-center font-sans tracking-wide">
      
      {/* Beige Metallic Wire Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: 'linear-gradient(#968f81 2px, transparent 2px), linear-gradient(90deg, #968f81 2px, transparent 2px)',
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Soft Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(235,231,224,0.95)_80%)] z-10 pointer-events-none" />

      {/* 3D Polaroids Grid */}
      <motion.div 
        className="relative z-20 grid grid-cols-5 grid-rows-3 gap-8 w-[160vw] md:w-[120vw] lg:w-[130vw] h-[160vh] md:h-[130vh] -top-5"
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
                scale: isHovered ? 1.6 : (isAnyHovered ? 0.9 : 1),
                opacity: isHovered ? 1 : (isAnyHovered ? 0.5 : 0.9),
                rotateZ: isHovered ? 0 : pic.rot,
                x: isHovered ? 0 : pic.x,
                y: isHovered ? 0 : pic.y,
                zIndex: isHovered ? 40 : 1,
                filter: isHovered ? "blur(0px) drop-shadow(0 35px 35px rgba(0,0,0,0.4))" : (isAnyHovered ? "blur(4px) brightness(0.9)" : "blur(0px) drop-shadow(0 15px 15px rgba(0,0,0,0.08))"),
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* White Polaroid Frame */}
              <div className="relative p-3 pb-12 bg-white rounded-sm w-[75%] max-w-[220px] h-full max-h-[260px] flex shadow-inner border border-[#d6d0c4]">
                
                {/* Wooden Peg / Clip element */}
                <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 w-8 h-6 bg-[#b1a491] shadow-sm border-b-[2px] border-[#928676] rounded-t-[2px] z-10 flex items-center justify-center transform -rotate-2">
                  <div className="w-2 h-2 rounded-full bg-black/30 shadow-inner" />
                </div>
                
                {/* Polaroid Image */}
                <div className="w-full h-full overflow-hidden bg-[#e0dbd3] group-hover:bg-[#d4cdbz]">
                  <img 
                    src={pic.imgUrl} 
                    alt="Memory"
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Glassmorphic Login Form Container */}
      <div className={`absolute z-30 inset-0 flex items-center justify-center pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${hoveredId !== null ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
        
        {/* Actual Form Box */}
        <div className="flex flex-col md:flex-row shadow-[0_40px_100px_rgba(0,0,0,0.15)] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-white/20 backdrop-blur-3xl border border-white/40 max-w-[900px] w-[92%] md:w-[80%] h-auto z-50 pointer-events-auto relative">
          
          {/* Subtle Darkening Overlay on Left for legibility */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-black/5 md:bg-black/10 z-0 pointer-events-none" />

          {/* Left Text/Branding Panel */}
          <div className="hidden md:flex flex-col justify-center p-12 lg:p-16 w-1/2 relative z-10 overflow-hidden border-r border-white/20 pointer-events-none select-none">
             <div className="relative z-10 text-stone-900 pointer-events-none">
                <h4 className="text-[2.6rem] leading-[0.9] mb-4 tracking-tighter" style={{ fontFamily: '"Playfair Display", serif' }}>
                  <span className="font-black uppercase text-[3.2rem] block">RELIVE</span>
                  <span className="font-black uppercase text-[3.2rem] block mb-2">YOUR MESS</span>
                  <span className="font-light italic text-[#8e826b] text-[2.4rem] block -mt-2">Memories With Us</span>
                  <span className="font-bold tracking-[0.2em] text-[1.2rem] text-stone-500 block mt-8 border-t border-stone-800/10 pt-6 uppercase italic">Travel Journal.</span>
                </h4>
                <p className="text-stone-700 text-sm leading-relaxed mt-4 font-semibold tracking-tight opacity-70">
                  Record your travel experiences and memories in your private journey. Every picture tells a unique story!
                </p>
             </div>
          </div>

          {/* Right Form Panel */}
          <div className="w-full md:w-1/2 p-10 md:p-16 bg-white/30 backdrop-blur-xl pointer-events-auto relative z-10 flex flex-col justify-center min-h-[500px]">
            <form onSubmit={handleSubmit} className="flex flex-col w-full pointer-events-auto">
              <h4 className="text-4xl font-black mb-10 text-stone-800 tracking-tighter">Login</h4>

              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-6 py-4 bg-white/50 border border-stone-200/60 shadow-sm text-stone-800 placeholder-stone-400 rounded-2xl focus:bg-white focus:border-stone-400 focus:shadow-md transition-all outline-none font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-red-600 text-[11px] font-bold uppercase tracking-wider pt-4 px-2"
                >
                  {error}
                </motion.p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4.5 bg-stone-800 hover:bg-black transition-all text-white rounded-2xl mt-10 font-black tracking-[0.2em] text-[11px] hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 h-[56px] flex items-center justify-center uppercase"
              >
                {loading ? "CHECKING MEMORIES..." : "SIGN IN"}
              </button>

              <div className="flex items-center justify-center my-10">
                <div className="h-[1px] bg-stone-300 w-full" />
                <p className="text-[10px] text-stone-400 px-4 uppercase font-black mx-2 whitespace-nowrap tracking-widest">OR</p>
                <div className="h-[1px] bg-stone-300 w-full" />
              </div>

              <button
                type="button"
                className="w-full py-4.5 bg-transparent border-2 border-stone-300 text-stone-600 hover:bg-stone-100/50 hover:border-stone-800 transition-all rounded-2xl font-black tracking-[0.2em] text-[10px] uppercase h-[56px]"
                onClick={() => navigate("/sign-up")}
              >
                CREATE ACCOUNT
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>



  )
}

export default Login
