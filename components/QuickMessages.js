import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes, FaComment } from 'react-icons/fa';

const PREMADE_MESSAGES = [
  "Smoked",
  "We're always in buttfuck nowwhere",
  "This is your home country",
  "Shut Up",
  "67",
  "One more",
  "Barely",
  "Yo this is australia"
];

export default function QuickMessages({ 
  isVisible = true, 
  onSendMessage = () => {},
  className = "" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (showCustomInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCustomInput]);

  const handlePremadeMessage = (message) => {
    onSendMessage(message);
    setIsOpen(false);
  };

  const handleCustomMessage = (e) => {
    e.preventDefault();
    if (customMessage.trim()) {
      onSendMessage(customMessage.trim());
      setCustomMessage('');
      setShowCustomInput(false);
      setIsOpen(false);
    }
  };

  const toggleCustomInput = () => {
    setShowCustomInput(!showCustomInput);
    if (!showCustomInput) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`quick-messages ${className}`}>
      {/* Quick Message Button */}
      <motion.button
        className="quick-message-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <FaComment className="btn-icon" />
        <span className="btn-text">Quick</span>
      </motion.button>

      {/* Messages Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="messages-panel"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="panel-header">
              <h3 className="panel-title">Quick Messages</h3>
              <button
                className="close-btn"
                onClick={() => setIsOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Premade Messages */}
            <div className="premade-messages">
              {PREMADE_MESSAGES.map((message, index) => (
                <motion.button
                  key={index}
                  className="premade-message"
                  onClick={() => handlePremadeMessage(message)}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  {message}
                </motion.button>
              ))}
            </div>

            {/* Custom Message Input */}
            <div className="custom-message-section">
              {!showCustomInput ? (
                <motion.button
                  className="custom-message-btn"
                  onClick={toggleCustomInput}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPaperPlane className="btn-icon" />
                  Send Custom Message
                </motion.button>
              ) : (
                <motion.form
                  className="custom-message-form"
                  onSubmit={handleCustomMessage}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="input-group">
                    <input
                      ref={inputRef}
                      type="text"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Type your message..."
                      maxLength={50}
                      className="custom-input"
                    />
                    <button
                      type="submit"
                      className="send-btn"
                      disabled={!customMessage.trim()}
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                  <div className="input-footer">
                    <span className="char-count">{customMessage.length}/50</span>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomMessage('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
