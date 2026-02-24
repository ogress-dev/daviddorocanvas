
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 1 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="w-screen h-screen bg-[#1E1E1D] relative"
    >
      {/* 
        User requested "no content". 
        Added a subtle, accessible way to return for usability without cluttering the design.
      */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 p-2 text-white/20 hover:text-white/60 transition-colors duration-300 rounded-full hover:bg-white/5"
        aria-label="Back to Home"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
    </motion.div>
  );
};

export default AboutPage;
