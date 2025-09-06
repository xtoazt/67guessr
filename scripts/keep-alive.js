// Keep services alive on Render free tier
// This script pings your services every 10 minutes to prevent them from sleeping

const services = [
  'https://your-api-server.onrender.com/api/health',
  'https://your-websocket-server.onrender.com/ws/health'
];

async function pingService(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(`✅ ${url} - ${data.status} (${new Date().toISOString()})`);
  } catch (error) {
    console.error(`❌ ${url} - Error: ${error.message}`);
  }
}

async function keepAlive() {
  console.log('🔄 Pinging services to keep them alive...');
  
  for (const service of services) {
    await pingService(service);
  }
  
  console.log('✅ Keep-alive cycle complete');
}

// Run every 10 minutes
setInterval(keepAlive, 10 * 60 * 1000);

// Run immediately
keepAlive();

console.log('🚀 Keep-alive service started. Pinging every 10 minutes.');
