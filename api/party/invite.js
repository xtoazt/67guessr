import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, secret, friendId, partyCode } = req.body;

    if (!userId || !secret || !friendId || !partyCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify the user making the invite
    const user = await User.findOne({ accountId: userId, secret });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is in the party
    if (user.currentParty !== partyCode) {
      return res.status(400).json({ error: 'Not in this party' });
    }

    // Find the friend to invite
    const friend = await User.findOne({ accountId: friendId });
    if (!friend) {
      return res.status(404).json({ error: 'Friend not found' });
    }

    // Check if they are friends
    if (!user.friends || !user.friends.includes(friendId)) {
      return res.status(400).json({ error: 'Not friends with this user' });
    }

    // Check if friend is already in a party
    if (friend.currentParty) {
      return res.status(400).json({ error: 'Friend is already in a party' });
    }

    // Add party invitation to friend's notifications
    if (!friend.notifications) {
      friend.notifications = [];
    }

    const invitation = {
      type: 'party_invite',
      from: userId,
      fromUsername: user.username,
      partyCode,
      timestamp: new Date(),
      read: false
    };

    friend.notifications.push(invitation);
    await friend.save();

    res.status(200).json({
      success: true,
      message: `Party invitation sent to ${friend.username}`
    });

  } catch (error) {
    console.error('Error sending party invitation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
