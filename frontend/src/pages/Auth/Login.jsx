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
      
      {/* Background Texture & Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.2]"
        style={{
          backgroundImage: 'linear-gradient(#968f81 1.5px, transparent 1.5px), linear-gradient(90deg, #968f81 1.5px, transparent 1.5px)',
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(235,231,224,0.95)_90%)] z-10 pointer-events-none" />

      {/* Dynamic Memory Cloud (Scatter Layout) */}
      <motion.div 
        className="absolute inset-0 z-20 overflow-visible"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {polaroids.map((pic, i) => {
          const isHovered = hoveredId === pic.id;
          const isAnyHovered = hoveredId !== null;
          
          // Calculate radial positions to avoid the center form
          // 15 images. Let's place them in 2 rings.
          const angle = (i / 15) * Math.PI * 2;
          const radius = i < 7 ? 32 : 48; // Two rings: inner (smaller) and outer (larger)
          const rx = Math.cos(angle) * radius + (Math.random() - 0.5) * 5;
          const ry = Math.sin(angle) * (radius * 0.8) + (Math.random() - 0.5) * 5;

          return (
            <motion.div
              key={pic.id}
              onHoverStart={() => setHoveredId(pic.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="absolute cursor-pointer group flex items-center justify-center"
              style={{
                left: `${50 + rx}%`,
                top: `${50 + ry}%`,
                width: '180px',
                height: '220px',
              }}
              animate={{
                scale: isHovered ? 1.5 : (isAnyHovered ? 0.85 : 1),
                opacity: isHovered ? 1 : (isAnyHovered ? 0.3 : 0.8),
                rotateZ: isHovered ? 0 : pic.rot,
                zIndex: isHovered ? 100 : 1,
                filter: isHovered ? "blur(0px) drop-shadow(0 20px 40px rgba(0,0,0,0.3))" : "blur(0px)",
                x: "-50%",
                y: "-50%",
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative p-2 pb-10 bg-white rounded-sm w-full h-full shadow-lg border border-[#d6d0c4]">
                <div className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-6 h-4 bg-[#b1a491] rounded-t-[1px] z-10 opacity-60" />
                <div className="w-full h-full overflow-hidden bg-[#e0dbd3]">
                  <img 
                    src={pic.imgUrl}
                    alt="Memory"
                    className="w-full h-full object-cover grayscale-[0.05] contrast-[1.05]"
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Glassmorphic Login Form */}
      <div className={`absolute z-40 inset-0 flex items-center justify-center pointer-events-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${hoveredId !== null ? 'opacity-0 scale-90 blur-xl' : 'opacity-100 scale-100 blur-0'}`}>
        
        <div className="flex flex-col md:flex-row shadow-[0_40px_100px_rgba(0,0,0,0.12)] rounded-[3rem] overflow-hidden bg-white/40 backdrop-blur-3xl border border-white/60 max-w-[880px] w-[94%] h-auto md:h-[560px] z-50 pointer-events-auto relative">
          
          {/* Subtle 'Peek' Hotspot (Invisible area to hover that also fades the form) */}
          <div 
            className="absolute top-0 right-0 w-12 h-12 z-[60] cursor-help flex items-center justify-center group/peek"
            onMouseEnter={() => setHoveredId('peek')}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-stone-300 group-hover/peek:scale-[10] group-hover/peek:bg-stone-100 transition-all duration-500" />
          </div>

          {/* Left Panel */}
          <div className="hidden md:flex flex-col justify-center p-14 bg-black/5 w-5/12 relative overflow-hidden border-r border-stone-200/20 select-none">
             <div className="relative z-10 text-stone-900">
                <h4 className="text-[2.6rem] leading-[0.95] mb-8 tracking-tighter" style={{ fontFamily: '"Playfair Display", serif' }}>
                  <span className="font-black uppercase block opacity-90">Chronicle</span>
                  <span className="font-extralight italic text-[#8e826b] block mt-1">Your Path</span>
                  <span className="font-bold tracking-[0.15em] text-[1.2rem] text-stone-500 block mt-4 border-t border-stone-800/5 pt-4">JOURNAL</span>
                </h4>
                <p className="text-stone-600 text-xs leading-relaxed mt-6 font-medium italic opacity-70">
                  "We travel not to escape life, but for life not to escape us."
                </p>
             </div>
             <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-stone-200/20 blur-3xl" />
          </div>

          {/* Right Panel - Form */}
          <div className="w-full md:w-7/12 p-8 md:p-14 bg-white/20">
            <form onSubmit={handleSubmit} className="flex flex-col h-full justify-center">
              <div className="mb-10 text-center md:text-left">
                <h4 className="text-4xl font-black text-stone-800 tracking-tighter">Welcome</h4>
                <p className="text-stone-500 text-sm mt-2 font-medium tracking-tight">Preserve your adventures today.</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full py-4 px-6 bg-white/80 border border-stone-200/60 focus:border-stone-400 focus:bg-white rounded-2xl outline-none transition-all shadow-sm text-stone-800 placeholder:text-stone-400 font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-red-500 text-xs font-bold mt-4 bg-red-50 px-4 py-3 rounded-xl border border-red-100 text-center uppercase tracking-wide"
                >
                  {error}
                </motion.p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-stone-800 hover:bg-stone-900 text-white rounded-2xl mt-10 font-black tracking-[0.2em] text-[10px] transition-all hover:shadow-2xl active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "VERIFYING..." : "ENTER JOURNAL"}
              </button>

              <div className="relative flex items-center justify-center my-10 px-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200/50"></div></div>
                <span className="relative px-4 bg-[#fcfbf9]/0 text-[9px] uppercase font-black text-stone-400 tracking-widest whitespace-nowrap">Explore more?</span>
              </div>

              <button
                type="button"
                className="w-full py-4 text-stone-500 hover:text-stone-800 transition-all font-black tracking-[0.2em] text-[10px] bg-stone-100/50 hover:bg-stone-100 flex items-center justify-center gap-3 rounded-2xl border border-stone-200/40"
                onClick={() => navigate("/sign-up")}
              >
                CREATE AN ACCOUNT
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>


  )
}

export default Login
