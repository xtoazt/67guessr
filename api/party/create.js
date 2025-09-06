import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, secret, gameMode = 'classic' } = req.body;

    if (!userId || !secret) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify the user
    const user = await User.findOne({ accountId: userId, secret });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is already in a party
    if (user.currentParty) {
      return res.status(400).json({ error: 'Already in a party' });
    }

    // Generate party code
    const partyCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create party
    const party = {
      code: partyCode,
      host: userId,
      members: [userId],
      gameMode,
      status: 'waiting', // waiting, starting, in-game, finished
      createdAt: new Date(),
      maxMembers: 4
    };

    // Update user with party info
    user.currentParty = partyCode;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        partyCode,
        party
      }
    });

  } catch (error) {
    console.error('Error creating party:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
