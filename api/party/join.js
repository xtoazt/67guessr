import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, secret, partyCode } = req.body;

    if (!userId || !secret || !partyCode) {
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

    // Find party by code (in a real app, you'd store parties in a separate collection)
    // For now, we'll simulate finding a party
    const host = await User.findOne({ currentParty: partyCode });
    if (!host) {
      return res.status(404).json({ error: 'Party not found' });
    }

    // Check if party is full (simplified - in real app, check party members count)
    const partyMembers = await User.find({ currentParty: partyCode });
    if (partyMembers.length >= 4) {
      return res.status(400).json({ error: 'Party is full' });
    }

    // Add user to party
    user.currentParty = partyCode;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Joined party ${partyCode}`,
      data: {
        partyCode,
        host: host.username
      }
    });

  } catch (error) {
    console.error('Error joining party:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
