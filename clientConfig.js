
export default function config() {
  const isHttps = window ? (window.location.protocol === "https:") : true;
  const prefixHttp = (isHttps ? "https" : "http") + "://";
  const prefixWs = (isHttps ? "wss" : "ws") + "://";

  // For Vercel deployment, use environment variables or fallback to WorldGuessr servers
  let apiUrl = process.env.NEXT_PUBLIC_API_URL || "api.worldguessr.com";
  let wsHost = process.env.NEXT_PUBLIC_WS_HOST || "server.worldguessr.com";

  // Clean up URLs - remove protocol if already included
  if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
    apiUrl = apiUrl.replace(/^https?:\/\//, '');
  }
  if (wsHost.startsWith('http://') || wsHost.startsWith('https://')) {
    wsHost = wsHost.replace(/^https?:\/\//, '');
  }
  if (wsHost.startsWith('ws://') || wsHost.startsWith('wss://')) {
    wsHost = wsHost.replace(/^wss?:\/\//, '');
  }

  // Remove trailing slashes
  apiUrl = apiUrl.replace(/\/$/, '');
  wsHost = wsHost.replace(/\/$/, '');

  return {
    "apiUrl": prefixHttp + apiUrl,
    "websocketUrl": prefixWs + wsHost + '/wg',
  }
}