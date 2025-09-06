export default function handler(req, res) {
  // Simple health check endpoint
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: '67guessr-api'
  });
}
