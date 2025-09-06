import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserPlus, 
  FaUserMinus, 
  FaCheck, 
  FaTimes, 
  FaUsers, 
  FaGamepad,
  FaCircle,
  FaSearch,
  FaUserFriends,
  FaPaperPlane
} from 'react-icons/fa';
import { useSession } from './auth/auth';
import config from '../clientConfig';

export default function FriendsManager({ isOpen, onClose }) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFriends = async () => {
    if (!session?.token?.secret) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${config().apiUrl}/friends/getFriends?userId=${session.token.accountId}&secret=${session.token.secret}`);
      const data = await response.json();
      
      if (data.success) {
        setFriends(data.data.friends || []);
        setSentRequests(data.data.sentRequests || []);
        setReceivedRequests(data.data.receivedRequests || []);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch friends');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && session?.token?.secret) {
      fetchFriends();
    }
  }, [isOpen, session?.token?.secret]);

  const sendFriendRequest = async (username) => {
    if (!session?.token?.secret) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${config().apiUrl}/friends/sendRequest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUserId: session.token.accountId,
          toUsername: username,
          secret: session.token.secret
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setSearchUsername('');
        fetchFriends();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to send friend request');
    } finally {
      setLoading(false);
    }
  };

  const acceptFriendRequest = async (fromUserId) => {
    if (!session?.token?.secret) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${config().apiUrl}/friends/acceptRequest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.token.accountId,
          fromUserId,
          secret: session.token.secret
        })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchFriends();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to accept friend request');
    } finally {
      setLoading(false);
    }
  };

  const declineFriendRequest = async (fromUserId) => {
    if (!session?.token?.secret) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${config().apiUrl}/friends/declineRequest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.token.accountId,
          fromUserId,
          secret: session.token.secret
        })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchFriends();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to decline friend request');
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (friendId) => {
    if (!session?.token?.secret) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${config().apiUrl}/friends/removeFriend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.token.accountId,
          friendId,
          secret: session.token.secret
        })
      });
      
      const data = await response.json();
      if (data.success) {
        fetchFriends();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to remove friend');
    } finally {
      setLoading(false);
    }
  };

  const inviteToParty = async (friendId) => {
    // This would integrate with the party system
    console.log('Invite to party:', friendId);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="friends-manager-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="friends-manager-modal"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="friends-header">
          <h2 className="friends-title">
            <FaUserFriends className="title-icon" />
            Friends
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Tabs */}
        <div className="friends-tabs">
          <button
            className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            <FaUsers />
            Friends ({friends.length})
          </button>
          <button
            className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <FaUserPlus />
            Requests ({receivedRequests.length})
          </button>
          <button
            className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            <FaPaperPlane />
            Sent ({sentRequests.length})
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Content */}
        <div className="friends-content">
          {/* Add Friend */}
          <div className="add-friend-section">
            <div className="search-input-group">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Enter username to add friend..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchUsername.trim()) {
                    sendFriendRequest(searchUsername.trim());
                  }
                }}
              />
              <button
                className="add-btn"
                onClick={() => sendFriendRequest(searchUsername.trim())}
                disabled={!searchUsername.trim() || loading}
              >
                <FaUserPlus />
              </button>
            </div>
          </div>

          {/* Friends List */}
          {activeTab === 'friends' && (
            <div className="friends-list">
              {friends.length === 0 ? (
                <div className="empty-state">
                  <FaUsers className="empty-icon" />
                  <p>No friends yet. Add some friends to start playing together!</p>
                </div>
              ) : (
                friends.map((friend) => (
                  <motion.div
                    key={friend.accountId}
                    className="friend-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="friend-info">
                      <div className="friend-avatar">
                        <FaCircle className={`status-indicator ${friend.isOnline ? 'online' : 'offline'}`} />
                      </div>
                      <div className="friend-details">
                        <h4 className="friend-name">{friend.username}</h4>
                        <p className="friend-status">
                          {friend.isOnline ? 'Online' : `Last seen ${new Date(friend.lastSeen).toLocaleDateString()}`}
                        </p>
                        <div className="friend-stats">
                          <span>{friend.stats.gamesPlayed} games</span>
                          <span>Best: {friend.stats.bestScore}</span>
                        </div>
                      </div>
                    </div>
                    <div className="friend-actions">
                      <button
                        className="action-btn invite-btn"
                        onClick={() => inviteToParty(friend.accountId)}
                        title="Invite to Party"
                      >
                        <FaGamepad />
                      </button>
                      <button
                        className="action-btn remove-btn"
                        onClick={() => removeFriend(friend.accountId)}
                        title="Remove Friend"
                      >
                        <FaUserMinus />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Received Requests */}
          {activeTab === 'requests' && (
            <div className="requests-list">
              {receivedRequests.length === 0 ? (
                <div className="empty-state">
                  <FaUserPlus className="empty-icon" />
                  <p>No pending friend requests</p>
                </div>
              ) : (
                receivedRequests.map((request) => (
                  <motion.div
                    key={request.accountId}
                    className="request-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="request-info">
                      <div className="request-avatar">
                        <FaCircle className={`status-indicator ${request.isOnline ? 'online' : 'offline'}`} />
                      </div>
                      <div className="request-details">
                        <h4 className="request-name">{request.username}</h4>
                        <p className="request-status">
                          {request.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="request-actions">
                      <button
                        className="action-btn accept-btn"
                        onClick={() => acceptFriendRequest(request.accountId)}
                        disabled={loading}
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="action-btn decline-btn"
                        onClick={() => declineFriendRequest(request.accountId)}
                        disabled={loading}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Sent Requests */}
          {activeTab === 'sent' && (
            <div className="sent-list">
              {sentRequests.length === 0 ? (
                <div className="empty-state">
                  <FaPaperPlane className="empty-icon" />
                  <p>No sent friend requests</p>
                </div>
              ) : (
                sentRequests.map((request) => (
                  <motion.div
                    key={request.accountId}
                    className="sent-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="sent-info">
                      <div className="sent-avatar">
                        <FaCircle className={`status-indicator ${request.isOnline ? 'online' : 'offline'}`} />
                      </div>
                      <div className="sent-details">
                        <h4 className="sent-name">{request.username}</h4>
                        <p className="sent-status">
                          {request.isOnline ? 'Online' : 'Offline'}
                        </p>
                        <p className="sent-pending">Request pending...</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
