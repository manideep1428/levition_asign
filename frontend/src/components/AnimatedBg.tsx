import { motion } from "framer-motion"
export default function AnimatedBg() {
  return(
    <div className="">
    <motion.div
      className="absolute inset-0"
      animate={{
        background: [
          'linear-gradient(to right, #00C9FF, #92FE9D)',
          'linear-gradient(to right, #FC466B, #3F5EFB)',
          'linear-gradient(to right, #3494E6, #EC6EAD)',
          'linear-gradient(to right, #00C9FF, #92FE9D)',
        ],
      }}
      transition={{
        duration: 10,
        ease: "linear",
        repeat: Infinity,
      }}
    />
    </div>
  )
}