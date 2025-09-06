/*
                    _     _
__      _____  _ __| | __| | __ _ _   _  ___  ___ ___ _ __
\ \ /\ / / _ \| '__| |/ _` |/ _` | | | |/ _ \/ __/ __| '__|
 \ V  V / (_) | |  | | (_| | (_| | |_| |  __/\__ \__ \ |
  \_/\_/ \___/|_|  |_|\__,_|\__, |\__,_|\___||___/___/_|  COMBINED API + WS
                            |___/
A game by Gautam

https://github.com/codergautam/worldguessr
*/

import fs from 'fs';
import { config } from 'dotenv';
import lookup from "coordinate_to_country"
const __dirname = import.meta.dirname;

config();

import mongoose from 'mongoose';
import cachegoose from 'recachegoose';

cachegoose(mongoose, {
  engine: "memory"
});

import Clue from './models/Clue.js';
import findLatLongRandom from './components/findLatLongServer.js';
import path from 'path';
import MapModel from './models/Map.js';
import bodyParser from 'body-parser';
import countries from './public/countries.json' with { type: "json" };

// colors
import colors from 'colors';

// express
import express from 'express';
var app = express();

// disable cors
import cors from 'cors';
import cityGen from './serverUtils/cityGen.js';
import User from './models/User.js';

function currentDate() {
  return new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
}

app.use(cors());
app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true, parameterLimit: 50000}));

// Import WebSocket functionality
import uws from 'uWebSockets.js';
import Player from './ws/classes/Player.js';
import { v4 as uuidv4 } from 'uuid';
import { Filter } from 'bad-words';
import Game from './ws/classes/Game.js';
import setCorsHeaders from './serverUtils/setCorsHeaders.js';
import { players, games, disconnectedPlayers } from './serverUtils/states.js';
import Memsave from './models/Memsave.js';
import blockedAt from 'blocked-at';
import { getLeagueRange } from './components/utils/leagues.js';
import calculateOutcomes from './components/utils/eloSystem.js';
import { tmpdir } from 'os';
import arbitraryWorld from './data/world-arbitrary.json' with { type: "json" };

// Redis setup
import { createClient } from 'redis';

let redisClient;
if(!process.env.REDIS_URI) {
  console.log("[MISSING-ENV WARN] REDIS_URI env variable not set".yellow);
} else {
  redisClient = createClient({
    url: process.env.REDIS_URI,
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
  });

  const main = async () => {
    await redisClient.connect();
    console.log('Connected to Redis');
  };

  main();
}

// Load all API routes
function loadFolder(folder, subdir = '') {
  const fullPath = path.join(__dirname, folder, subdir);
  if (!fs.existsSync(fullPath)) return;
  
  const items = fs.readdirSync(fullPath);
  items.forEach(item => {
    const itemPath = path.join(fullPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      loadFolder(folder, path.join(subdir, item));
    } else if (item.endsWith('.js')) {
      const routePath = path.join(subdir, item.replace('.js', ''));
      const route = `/${routePath}`;
      
      try {
        const module = await import(`./${folder}/${routePath}.js`);
        if (module.default && typeof module.default === 'function') {
          app.use(route, module.default);
          console.log(`Loaded route: ${route}`.green);
        }
      } catch (error) {
        console.log(`Failed to load route: ${route}`.red, error.message);
      }
    }
  });
}

// Load API routes
await loadFolder('api');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// WebSocket server setup
const port = process.env.PORT || 3001;

// Start Express server
const server = app.listen(port, () => {
  console.log(`🚀 Combined API + WS Server running on port ${port}`.green);
  console.log(`📡 API endpoints available at http://localhost:${port}`.blue);
  console.log(`🔌 WebSocket available at ws://localhost:${port}/wg`.blue);
});

// WebSocket server using uWebSockets.js
let wsApp = uws.App({});

// WebSocket routes
wsApp.ws('/wg', {
  compression: uws.SHARED_COMPRESSOR,
  maxPayloadLength: 16 * 1024 * 1024,
  idleTimeout: 60,
  
  upgrade: (res, req, context) => {
    let ip = req.getHeader('x-forwarded-for') || req.getHeader('cf-connecting-ip') || 'unknown';
    if(ip.includes(',')) {
      ip = ip.split(',')[0];
    }
    
    // Basic IP filtering (you can add your banned IPs logic here)
    res.upgrade({ id: uuidv4(), ip },
      req.getHeader('sec-websocket-key'),
      req.getHeader('sec-websocket-protocol'),
      req.getHeader('sec-websocket-extensions'), context,
    );
  },

  open: (ws, req) => {
    const ip = ws.ip;
    const id = ws.id;
    const connectTime = Date.now();
    
    ws.connectTime = connectTime;
    
    const player = new Player(ws, id, ip);
    players.set(id, player);

    player.send({
      type: 't',
      t: Date.now()
    });

    player.send({
      type: 'restartQueued',
      value: false
    });
  },

  message: (ws, message, isBinary) => {
    try {
      const data = JSON.parse(message);
      const player = players.get(ws.id);
      
      if (player) {
        player.handleMessage(data);
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  },

  close: (ws, code, message) => {
    const player = players.get(ws.id);
    if (player) {
      player.disconnect();
      players.delete(ws.id);
    }
  }
});

// Start WebSocket server on the same port
wsApp.listen('0.0.0.0', port, (ws) => {
  if (ws) {
    console.log(`🔌 WebSocket server started on port ${port}`.green);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
