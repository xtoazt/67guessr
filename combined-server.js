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
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

import mongoose from 'mongoose';
import cachegoose from 'recachegoose';

cachegoose(mongoose, {
  engine: "memory"
});

// colors
import colors from 'colors';

// express
import express from 'express';
var app = express();

// disable cors
import cors from 'cors';
import bodyParser from 'body-parser';

function currentDate() {
  return new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
}

app.use(cors());
app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true, parameterLimit: 50000}));

// Health check endpoint - MUST be first
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: process.env.PORT || 3001
  });
});

// Basic API endpoint for testing
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Load all API routes
async function loadFolder(folder, subdir = '') {
  const fullPath = path.join(__dirname, folder, subdir);
  if (!fs.existsSync(fullPath)) {
    console.log(`Folder not found: ${fullPath}`.yellow);
    return;
  }
  
  const items = fs.readdirSync(fullPath);
  for (const item of items) {
    const itemPath = path.join(fullPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      await loadFolder(folder, path.join(subdir, item));
    } else if (item.endsWith('.js')) {
      const routePath = path.join(subdir, item.replace('.js', ''));
      const route = `/${routePath}`;
      
      try {
        const module = await import(`./${folder}/${routePath}.js`);
        if (module.default && typeof module.default === 'function') {
          app.use(route, module.default);
          console.log(`✅ Loaded route: ${route}`.green);
        }
      } catch (error) {
        console.log(`❌ Failed to load route: ${route}`.red, error.message);
      }
    }
  }
}

// Load API routes
try {
  await loadFolder('api');
  console.log('✅ API routes loaded successfully'.green);
} catch (error) {
  console.log('❌ Error loading API routes:'.red, error.message);
}

// Import WebSocket functionality
import uws from 'uWebSockets.js';
import { v4 as uuidv4 } from 'uuid';

// WebSocket server setup
const port = process.env.PORT || 3001;

// Start Express server
const server = app.listen(port, '0.0.0.0', () => {
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
    
    console.log(`🔌 WebSocket connection opened: ${id}`.blue);

    ws.send(JSON.stringify({
      type: 't',
      t: Date.now()
    }));

    ws.send(JSON.stringify({
      type: 'restartQueued',
      value: false
    }));
  },

  message: (ws, message, isBinary) => {
    try {
      const data = JSON.parse(message);
      console.log(`📨 WebSocket message received: ${data.type}`.cyan);
      
      // Basic message handling
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', t: Date.now() }));
      }
    } catch (error) {
      console.error('❌ WebSocket message error:'.red, error);
    }
  },

  close: (ws, code, message) => {
    console.log(`🔌 WebSocket connection closed: ${ws.id}`.yellow);
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

console.log('✅ Combined server initialized successfully!'.green);
