import { motion } from 'framer-motion';
import "./Loader.css";
function Loader() {

const dotVariants = {
    jump: {
        y: -30,
        transition: {
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut",
        },
    },
}
  return (
      <div className='loader'>
      <motion.div
          className="container"
      >
          <motion.div className="dot" variants={dotVariants} animate="jump" />
          <motion.div className="dot" variants={dotVariants} animate="jump" />
          <motion.div className="dot" variants={dotVariants} animate="jump" />
      </motion.div>
    </div>
  );
}

export default Loader;