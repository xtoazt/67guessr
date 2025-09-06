import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, fromUserId, secret } = req.body;

    if (!userId || !fromUserId || !secret) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify the user accepting the request
    const user = await User.findOne({ accountId: userId, secret });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find the user who sent the request
    const fromUser = await User.findOne({ accountId: fromUserId });
    if (!fromUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if request exists
    if (!user.receivedFriendRequests || !user.receivedFriendRequests.includes(fromUserId)) {
      return res.status(400).json({ error: 'Friend request not found' });
    }

    // Remove from received requests
    user.receivedFriendRequests = user.receivedFriendRequests.filter(id => id !== fromUserId);
    
    // Add to friends list
    if (!user.friends) {
      user.friends = [];
    }
    user.friends.push(fromUserId);

    // Remove from sent requests for the other user
    if (fromUser.sentFriendRequests) {
      fromUser.sentFriendRequests = fromUser.sentFriendRequests.filter(id => id !== userId);
    }
    
    // Add to their friends list
    if (!fromUser.friends) {
      fromUser.friends = [];
    }
    fromUser.friends.push(userId);

    await user.save();
    await fromUser.save();

    res.status(200).json({ 
      success: true, 
      message: `You are now friends with ${fromUser.username}` 
    });

  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
