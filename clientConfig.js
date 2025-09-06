
export default function config() {
  const isHttps = window ? (window.location.protocol === "https:") : true;
  const prefixHttp = (isHttps ? "https" : "http") + "://";
  const prefixWs = (isHttps ? "wss" : "ws") + "://";

  // For Vercel deployment, use environment variables or fallback to localhost
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "localhost:3001";
  const wsHost = process.env.NEXT_PUBLIC_WS_HOST || process.env.NEXT_PUBLIC_API_URL || "localhost:3002";

  return {
    "apiUrl": prefixHttp + apiUrl,
    "websocketUrl": prefixWs + wsHost + '/wg',
  }
}