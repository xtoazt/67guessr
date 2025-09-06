import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, secret } = req.query;

    if (!userId || !secret) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify the user
    const user = await User.findOne({ accountId: userId, secret });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get friends data
    const friends = [];
    const sentRequests = [];
    const receivedRequests = [];

    // Get friends details
    if (user.friends && user.friends.length > 0) {
      const friendUsers = await User.find({ accountId: { $in: user.friends } });
      friends.push(...friendUsers.map(friend => ({
        accountId: friend.accountId,
        username: friend.username,
        isOnline: friend.isOnline || false,
        lastSeen: friend.lastSeen,
        stats: {
          gamesPlayed: friend.gamesPlayed || 0,
          averageScore: friend.averageScore || 0,
          bestScore: friend.bestScore || 0
        }
      })));
    }

    // Get sent requests details
    if (user.sentFriendRequests && user.sentFriendRequests.length > 0) {
      const sentUsers = await User.find({ accountId: { $in: user.sentFriendRequests } });
      sentRequests.push(...sentUsers.map(user => ({
        accountId: user.accountId,
        username: user.username,
        isOnline: user.isOnline || false
      })));
    }

    // Get received requests details
    if (user.receivedFriendRequests && user.receivedFriendRequests.length > 0) {
      const receivedUsers = await User.find({ accountId: { $in: user.receivedFriendRequests } });
      receivedRequests.push(...receivedUsers.map(user => ({
        accountId: user.accountId,
        username: user.username,
        isOnline: user.isOnline || false
      })));
    }

    res.status(200).json({
      success: true,
      data: {
        friends,
        sentRequests,
        receivedRequests
      }
    });

  } catch (error) {
    console.error('Error getting friends:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
