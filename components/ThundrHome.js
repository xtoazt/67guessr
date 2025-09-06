import { useState, useEffect } from 'react';
import { useSession, signOut } from './auth/auth';
import LoginModal from './auth/LoginModal';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaUsers, FaMap, FaTrophy, FaUser, FaSignOutAlt, FaGlobe } from 'react-icons/fa';

export default function ThundrHome() {
  const { data: session } = useSession();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('play');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleNavigation = (path) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  };

  const handleSoloGame = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/en';
    }
  };

  const handleMultiplayer = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/en?mode=multiplayer';
    }
  };

  return (
    <div className="thundr-home">
      {/* Navigation */}
      <motion.nav
        className="thundr-nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="nav-container">
          <motion.div
            className="logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="logo-text">67guessr</span>
          </motion.div>

          <div className="nav-actions">
            {session?.token?.secret ? (
              <motion.div
                className="user-menu"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="username-display">{session.token.username}</span>
                <motion.button
                  className="btn-signout"
                  onClick={() => signOut()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSignOutAlt className="btn-icon" />
                  Sign Out
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                className="btn-signin"
                onClick={() => setLoginModalOpen(true)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUser className="btn-icon" />
                Sign In
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <motion.main
        className="thundr-main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="minimal-container">
          {/* Tabs */}
          <div className="tabs-container">
            <button
              className={`tab ${activeTab === 'play' ? 'active' : ''}`}
              onClick={() => setActiveTab('play')}
            >
              <FaPlay />
              Play
            </button>
            <button
              className={`tab ${activeTab === 'explore' ? 'active' : ''}`}
              onClick={() => setActiveTab('explore')}
            >
              <FaMap />
              Explore
            </button>
            <button
              className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <FaTrophy />
              Stats
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'play' && (
              <motion.div
                className="play-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Start Playing</h2>
                <div className="game-buttons">
                  <motion.button
                    className="btn-primary"
                    onClick={handleSoloGame}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPlay />
                    Solo Game
                  </motion.button>
                  <motion.button
                    className="btn-secondary"
                    onClick={handleMultiplayer}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaUsers />
                    Multiplayer
                  </motion.button>
                </div>
              </motion.div>
            )}

            {activeTab === 'explore' && (
              <motion.div
                className="explore-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Explore</h2>
                <div className="explore-buttons">
                  <motion.button
                    className="btn-tertiary"
                    onClick={() => handleNavigation('/maps')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaMap />
                    Community Maps
                  </motion.button>
                  <motion.button
                    className="btn-quaternary"
                    onClick={() => handleNavigation('/learn')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaGlobe />
                    Learn Geography
                  </motion.button>
                </div>
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                className="stats-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Statistics</h2>
                <div className="stats-buttons">
                  <motion.button
                    className="btn-quaternary"
                    onClick={() => handleNavigation('/leaderboard')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTrophy />
                    Leaderboard
                  </motion.button>
                  {!session?.token?.secret && (
                    <motion.button
                      className="btn-signup"
                      onClick={() => setLoginModalOpen(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaUser />
                      Sign In for Stats
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.main>

      {/* Login Modal */}
      <AnimatePresence>
        {loginModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoginModal
              isOpen={loginModalOpen}
              onClose={() => setLoginModalOpen(false)}
              onLogin={() => {
                setLoginModalOpen(false);
                // Session will be updated automatically
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}