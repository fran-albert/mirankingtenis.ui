import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { GiTennisBall } from 'react-icons/gi';

const loaderContainerStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9999,
};

function Loading({ isLoading }: { isLoading: boolean }) {
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  if (!isLoading) {
    return null; 
  }

  return (
    <div className="sweet-loading" style={loaderContainerStyle}>
      <motion.div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: [0, 360] }}
        transition={{
          duration: 1,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        <GiTennisBall size={150} color="#0f172a" />
      </motion.div>
    </div>
  );
}

export default Loading;
