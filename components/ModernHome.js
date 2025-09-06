import { useState, useEffect } from 'react';
import { useSession, signOut } from './auth/auth';
import LoginModal from './auth/LoginModal';
import ChatWidget from './ChatWidget';
import { FaPlay, FaUsers, FaTrophy, FaGlobe, FaRocket, FaStar, FaGamepad, FaChartLine } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModernHome() {
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
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="modern-home">
      {/* Animated Background */}
      <div className="bg-animation">
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
        <div className="bg-gradient-3"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        className="modern-navbar"
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
            <FaGlobe className="logo-icon" />
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
                  Welcome, <span className="username">{session.token.username}</span>
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
        className="main-content"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Hero Section */}
        <motion.section className="hero-section" variants={itemVariants}>
          <div className="hero-content">
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Explore the <span className="gradient-text">World</span>
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Drop into random street views around the globe and test your geography skills. 
              Challenge yourself or compete with friends in this immersive guessing game.
            </motion.p>
            
            <motion.div 
              className="hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="stat-item">
                <FaUsers className="stat-icon" />
                <span className="stat-number">1,234</span>
                <span className="stat-label">Players Online</span>
              </div>
              <div className="stat-item">
                <FaGlobe className="stat-icon" />
                <span className="stat-number">195</span>
                <span className="stat-label">Countries</span>
              </div>
              <div className="stat-item">
                <FaTrophy className="stat-icon" />
                <span className="stat-number">50K+</span>
                <span className="stat-label">Games Played</span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Game Modes */}
        <motion.section className="game-modes" variants={itemVariants}>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Choose Your Adventure
          </motion.h2>
          
          <div className="modes-grid">
            <motion.div 
              className="mode-card single-player"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-icon">
                  <FaGamepad />
                </div>
                <h3 className="card-title">Single Player</h3>
                <p className="card-description">
                  Explore the world at your own pace. Perfect your geography skills 
                  with unlimited practice rounds and detailed feedback.
                </p>
                <motion.button 
                  className="card-button primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlay className="button-icon" />
                  Start Solo Game
                </motion.button>
              </div>
            </motion.div>

            <motion.div 
              className="mode-card multiplayer"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-icon">
                  <FaUsers />
                </div>
                <h3 className="card-title">Multiplayer</h3>
                <p className="card-description">
                  Challenge friends or random players in real-time battles. 
                  See who can guess locations the fastest and most accurately.
                </p>
                {session?.token?.secret ? (
                  <motion.button 
                    className="card-button secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaUsers className="button-icon" />
                    Join Battle
                  </motion.button>
                ) : (
                  <motion.button 
                    className="card-button secondary"
                    onClick={() => setLoginModalOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaRocket className="button-icon" />
                    Sign In to Play
                  </motion.button>
                )}
              </div>
            </motion.div>

            <motion.div 
              className="mode-card stats"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-icon">
                  <FaChartLine />
                </div>
                <h3 className="card-title">Your Progress</h3>
                <p className="card-description">
                  Track your performance, view detailed statistics, and climb 
                  the leaderboards to become a geography master.
                </p>
                {session?.token?.secret ? (
                  <motion.button 
                    className="card-button tertiary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaChartLine className="button-icon" />
                    View Stats
                  </motion.button>
                ) : (
                  <motion.button 
                    className="card-button tertiary"
                    onClick={() => setLoginModalOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaStar className="button-icon" />
                    Sign In to Track
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section className="features-section" variants={itemVariants}>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            Why Choose 67guessr?
          </motion.h2>
          
          <div className="features-grid">
            <motion.div 
              className="feature-item"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="feature-icon">
                <FaGlobe />
              </div>
              <h3 className="feature-title">Global Coverage</h3>
              <p className="feature-description">
                Explore street views from every corner of the world, from bustling cities 
                to remote villages and natural wonders.
              </p>
            </motion.div>
            
            <motion.div 
              className="feature-item"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <div className="feature-icon">
                <FaRocket />
              </div>
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-description">
                Optimized for speed with instant loading, smooth animations, and 
                responsive design that works on any device.
              </p>
            </motion.div>
            
            <motion.div 
              className="feature-item"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <div className="feature-icon">
                <FaTrophy />
              </div>
              <h3 className="feature-title">Competitive Play</h3>
              <p className="feature-description">
                Climb the leaderboards, earn achievements, and compete with players 
                worldwide in our ranking system.
              </p>
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

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
