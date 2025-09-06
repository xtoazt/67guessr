import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, friendId, secret } = req.body;

    if (!userId || !friendId || !secret) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify the user removing the friend
    const user = await User.findOne({ accountId: userId, secret });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find the friend to remove
    const friend = await User.findOne({ accountId: friendId });
    if (!friend) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if they are friends
    if (!user.friends || !user.friends.includes(friendId)) {
      return res.status(400).json({ error: 'Not friends' });
    }

    // Remove from friends list
    user.friends = user.friends.filter(id => id !== friendId);
    
    // Remove from their friends list too
    if (friend.friends) {
      friend.friends = friend.friends.filter(id => id !== userId);
    }

    await user.save();
    await friend.save();

    res.status(200).json({ 
      success: true, 
      message: `Removed ${friend.username} from friends` 
    });

  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
