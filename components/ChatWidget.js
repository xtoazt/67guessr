import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaExpand, FaCompress } from 'react-icons/fa';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load the chat widget after a short delay to improve initial page load
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className="chat-toggle-btn"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <FaComments className="chat-icon" />
        {!isOpen && (
          <motion.div
            className="chat-notification"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, duration: 0.2 }}
          >
            <span>Chat</span>
          </motion.div>
        )}
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && isLoaded && (
          <motion.div
            className={`chat-widget ${isMinimized ? 'minimized' : ''}`}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-content">
                <div className="chat-title">
                  <FaComments className="header-icon" />
                  <span>67guessr Chat</span>
                </div>
                <div className="chat-actions">
                  <motion.button
                    className="chat-action-btn"
                    onClick={toggleMinimize}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isMinimized ? <FaExpand /> : <FaCompress />}
                  </motion.button>
                  <motion.button
                    className="chat-action-btn close"
                    onClick={toggleChat}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <motion.div
                className="chat-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <iframe
                  src="https://eclipxe.vercel.app/"
                  className="chat-iframe"
                  title="67guessr Chat"
                  allow="microphone; camera; fullscreen"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isOpen && !isLoaded && (
        <motion.div
          className="chat-widget loading"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="chat-header">
            <div className="chat-header-content">
              <div className="chat-title">
                <FaComments className="header-icon" />
                <span>67guessr Chat</span>
              </div>
              <motion.button
                className="chat-action-btn close"
                onClick={toggleChat}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes />
              </motion.button>
            </div>
          </div>
          <div className="chat-loading">
            <motion.div
              className="loading-spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FaComments />
            </motion.div>
            <p>Loading chat...</p>
          </div>
        </motion.div>
      )}
    </>
  );
}
