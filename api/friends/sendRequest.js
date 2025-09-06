import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fromUserId, toUsername, secret } = req.body;

    if (!fromUserId || !toUsername || !secret) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify the user making the request
    const fromUser = await User.findOne({ accountId: fromUserId, secret });
    if (!fromUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find the target user
    const toUser = await User.findOne({ username: toUsername });
    if (!toUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (fromUser.accountId === toUser.accountId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if already friends
    if (fromUser.friends && fromUser.friends.includes(toUser.accountId)) {
      return res.status(400).json({ error: 'Already friends' });
    }

    // Check if request already exists
    if (fromUser.sentFriendRequests && fromUser.sentFriendRequests.includes(toUser.accountId)) {
      return res.status(400).json({ error: 'Friend request already sent' });
    }

    // Check if they already sent you a request
    if (fromUser.receivedFriendRequests && fromUser.receivedFriendRequests.includes(toUser.accountId)) {
      return res.status(400).json({ error: 'This user already sent you a friend request' });
    }

    // Add to sent requests
    if (!fromUser.sentFriendRequests) {
      fromUser.sentFriendRequests = [];
    }
    fromUser.sentFriendRequests.push(toUser.accountId);

    // Add to target user's received requests
    if (!toUser.receivedFriendRequests) {
      toUser.receivedFriendRequests = [];
    }
    toUser.receivedFriendRequests.push(fromUser.accountId);

    await fromUser.save();
    await toUser.save();

    res.status(200).json({ 
      success: true, 
      message: `Friend request sent to ${toUsername}` 
    });

  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
