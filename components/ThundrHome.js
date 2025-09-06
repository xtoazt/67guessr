import { useState, useEffect } from 'react';
import { useSession, signOut } from './auth/auth';
import LoginModal from './auth/LoginModal';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaRocket, FaBolt, FaUsers } from 'react-icons/fa';

export default function ThundrHome() {
  const { data: session } = useSession();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="thundr-home">
      {/* Animated Background */}
      <div className="thundr-bg">
        <div className="thundr-grid"></div>
        <div className="thundr-particles">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <motion.nav 
        className="thundr-nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-container">
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <FaBolt className="logo-icon" />
            <span className="logo-text">67guessr</span>
          </motion.div>
          
          
          <div className="nav-actions">
            {session?.token?.secret ? (
              <motion.div 
                className="user-menu"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span className="welcome-text">
                  {session.token.username}
                </span>
                <motion.button 
                  className="btn-signout"
                  onClick={() => signOut()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Out
                </motion.button>
              </motion.div>
            ) : (
              <motion.button 
                className="btn-signin"
                onClick={() => setLoginModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <FaRocket className="btn-icon" />
                Sign In
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <motion.main 
        className="thundr-main"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Hero Section */}
        <motion.section className="thundr-hero" variants={itemVariants}>
          <div className="hero-content">
            <motion.div 
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FaBolt className="badge-icon" />
              <span>Explore the World</span>
            </motion.div>
            
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Guess the <span className="gradient-text">location</span>
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Drop into random street views and test your geography skills.<br />
              Play solo or challenge others in real-time multiplayer.
            </motion.p>
            
            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.button 
                className="btn-primary"
                onClick={() => window.location.href = '/en'}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlay className="btn-icon" />
                Solo Game
              </motion.button>
              
              <motion.button 
                className="btn-secondary"
                onClick={() => window.location.href = '/en?mode=multiplayer'}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUsers className="btn-icon" />
                Multiplayer
              </motion.button>
              
              {!session?.token?.secret && (
                <motion.button 
                  className="btn-tertiary"
                  onClick={() => setLoginModalOpen(true)}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 215, 0, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaRocket className="btn-icon" />
                  Sign In for Friends & Stats
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.section>

      </motion.main>


      {/* Login Modal */}
      <AnimatePresence>
        {loginModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLoginModalOpen(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <LoginModal 
                isOpen={loginModalOpen} 
                onClose={() => setLoginModalOpen(false)} 
                onLogin={() => {
                  setLoginModalOpen(false);
                }} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
