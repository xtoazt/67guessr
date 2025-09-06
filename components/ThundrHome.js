import { useState, useEffect } from 'react';
import { useSession, signOut } from './auth/auth';
import LoginModal from './auth/LoginModal';
import QuickMessages from './QuickMessages';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaUsers, FaTrophy, FaGlobe, FaRocket, FaStar, FaGamepad, FaChartLine, FaBolt, FaCompass } from 'react-icons/fa';

export default function ThundrHome() {
  const { data: session } = useSession();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

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
          
          <div className="nav-tabs">
            {['home', 'games', 'apps', 'ai'].map((tab) => (
              <motion.button
                key={tab}
                className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
          
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
              Drop into <span className="gradient-text">random locations</span><br />
              and test your geography skills
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Challenge yourself or compete with friends in this immersive guessing game.<br />
              From bustling cities to remote villages - explore every corner of the globe.
            </motion.p>
            
            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.button 
                className="btn-primary"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlay className="btn-icon" />
                Start Solo Game
              </motion.button>
              
              {session?.token?.secret ? (
                <motion.button 
                  className="btn-secondary"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUsers className="btn-icon" />
                  Join Battle
                </motion.button>
              ) : (
                <motion.button 
                  className="btn-secondary"
                  onClick={() => setLoginModalOpen(true)}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaRocket className="btn-icon" />
                  Sign In to Play
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section className="thundr-stats" variants={itemVariants}>
          <div className="stats-grid">
            <motion.div 
              className="stat-card"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <div className="stat-number">1,234</div>
                <div className="stat-label">Players Online</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="stat-icon">
                <FaGlobe />
              </div>
              <div className="stat-content">
                <div className="stat-number">195</div>
                <div className="stat-label">Countries</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="stat-icon">
                <FaTrophy />
              </div>
              <div className="stat-content">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Games Played</div>
              </div>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="stat-icon">
                <FaCompass />
              </div>
              <div className="stat-content">
                <div className="stat-number">∞</div>
                <div className="stat-label">Locations</div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Game Modes */}
        <motion.section className="thundr-modes" variants={itemVariants}>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
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
      </motion.main>

      {/* Quick Messages */}
      <QuickMessages 
        isVisible={true}
        onSendMessage={(message) => {
          console.log('Quick message sent:', message);
          // TODO: Integrate with WebSocket for real-time messaging
        }}
      />

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
