import { useState, useEffect } from 'react';
import { useSession, signOut } from './auth/auth';
import LoginModal from './auth/LoginModal';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaUsers, FaMap, FaTrophy, FaUser, FaSignOutAlt, FaGlobe } from 'react-icons/fa';

export default function ThundrHome() {
  const { data: session } = useSession();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleNavigation = (path) => {
    // Use proper navigation
    if (typeof window !== 'undefined') {
      window.location.href = path;
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
        <motion.section
          className="thundr-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="hero-content">
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Guess the location
            </motion.h1>

            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Drop into random street views and test your geography skills.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.button
                className="btn-primary"
                onClick={() => handleNavigation('/en')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlay className="btn-icon" />
                Solo Game
              </motion.button>

              <motion.button
                className="btn-secondary"
                onClick={() => handleNavigation('/en?mode=multiplayer')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUsers className="btn-icon" />
                Multiplayer
              </motion.button>

              <motion.button
                className="btn-tertiary"
                onClick={() => handleNavigation('/maps')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaMap className="btn-icon" />
                Community Maps
              </motion.button>

              <motion.button
                className="btn-quaternary"
                onClick={() => handleNavigation('/leaderboard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrophy className="btn-icon" />
                Leaderboard
              </motion.button>

              <motion.button
                className="btn-quinary"
                onClick={() => handleNavigation('/learn')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGlobe className="btn-icon" />
                Learn Geography
              </motion.button>

              {!session?.token?.secret && (
                <motion.button
                  className="btn-signup"
                  onClick={() => setLoginModalOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUser className="btn-icon" />
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