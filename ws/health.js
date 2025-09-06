// Health check endpoint for WebSocket server
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: '67guessr-ws',
    websocket: 'active'
  });
}
