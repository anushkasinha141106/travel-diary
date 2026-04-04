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
    <div className="relative w-full h-[100vh] bg-[#ebe7e0] overflow-hidden flex items-center justify-center font-sans tracking-wide">
      
      {/* Beige Metallic Wire Grid (Image 2 style adjusted) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: 'linear-gradient(#968f81 2px, transparent 2px), linear-gradient(90deg, #968f81 2px, transparent 2px)',
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Soft Vignette overlay (white walls fading out) */}
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
                    // src=
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

      {/* Glassmorphic Login Form in center (pointer-events-none wrapped allows clicking on stuff outside!) */}
      <div className={`absolute z-30 inset-0 flex items-center justify-center pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${hoveredId !== null ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
        
        {/* Actual Form Box (pointer-events-none on parent allows reaching through the glass!) */}
        <div className="flex flex-col md:flex-row shadow-[0_20px_60px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden bg-white/20 backdrop-blur-2xl border border-white/50 max-w-[850px] w-[90%] md:w-[75%] h-auto z-50 pointer-events-none mix-blend-luminosity">
          
          {/* Left Text/Branding Panel (Passes mouse events straight through to the 3D grid!) */}
          <div className="hidden md:flex flex-col justify-center p-12 bg-white/10 w-1/2 relative overflow-hidden backdrop-blur-md border-r border-white/20">
             <div className="relative z-10 text-stone-900">
                <h4 className="text-[2.6rem] leading-[1.05] mb-4 tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
                  <span className="font-extrabold uppercase text-[2.8rem]">RELIVE YOUR</span><br/>
                  <span className="italic font-normal text-stone-700">MEMORIES WITH US</span><br/>
                  <span className="font-bold tracking-widest text-[2rem] text-[#8e826b]">TRAVEL JOURNAL.</span>
                </h4>
                <p className="text-stone-700 text-sm leading-relaxed mt-5 font-semibold tracking-wide border-t border-stone-800/20 pt-4">
                  Record your travel experiences and memories in your private journey. Every "picture_tells your story!
                </p>
             </div>
          </div>

          {/* Right Form Component (pointer-events-auto restores clicks specifically here so typing is safe) */}
          <div className="w-full md:w-1/2 p-10 md:p-14 bg-white/30 backdrop-blur-xl pointer-events-auto">
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 h-full justify-center">
              <h4 className="text-3xl font-bold mb-8 text-stone-800 tracking-tight">Welcome Back</h4>

              <input
                type="email"
                placeholder="Email Address"
                className="input-box bg-white/40 border border-stone-300 shadow-sm mb-4 text-stone-800 placeholder-stone-500 rounded-md focus:bg-white/60 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="text-red-600 text-sm font-medium pt-2 pb-1">{error}</p>}

              {loading ? (
                <p className="animate-pulse w-full text-center py-3 bg-stone-500 text-white rounded-md mt-4 font-semibold tracking-wide shadow-lg">
                  VERIFYING...
                </p>
              ) : (
                <button type="submit" className="w-full py-3 bg-stone-800 hover:bg-stone-900 transition-colors text-white rounded-md mt-4 font-semibold tracking-wider hover:shadow-xl hover:-translate-y-[1px] transform duration-200">
                  LOGIN
                </button>
              )}

              <div className="flex items-center justify-center my-6">
                <div className="h-[1px] bg-stone-300 w-full" />
                <p className="text-xs text-stone-500 px-3 uppercase font-semibold mx-2 whitespace-nowrap">Or</p>
                <div className="h-[1px] bg-stone-300 w-full" />
              </div>

              <button
                type="button"
                className="w-full py-3 bg-transparent border-2 border-stone-400 text-stone-700 hover:bg-stone-100/50 hover:border-stone-500 transition-colors rounded-md font-semibold tracking-wider shadow-sm"
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
