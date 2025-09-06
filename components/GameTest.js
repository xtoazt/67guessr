import { useState, useEffect } from 'react';
import clientConfig from '@/clientConfig';

export default function GameTest() {
  const [config, setConfig] = useState(null);
  const [apiTest, setApiTest] = useState(null);
  const [wsTest, setWsTest] = useState(null);

  useEffect(() => {
    const configData = clientConfig();
    setConfig(configData);
    
    // Test API connection
    fetch(`${configData.apiUrl}/api/health`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(`HTTP ${response.status}`);
      })
      .then(data => {
        setApiTest({ success: true, data });
      })
      .catch(error => {
        setApiTest({ success: false, error: error.message });
      });

    // Test WebSocket connection
    try {
      const ws = new WebSocket(configData.websocketUrl);
      
      ws.onopen = () => {
        setWsTest({ success: true, message: 'Connected' });
        ws.close();
      };
      
      ws.onerror = (error) => {
        setWsTest({ success: false, error: 'Connection failed' });
      };
      
      ws.onclose = () => {
        if (wsTest?.success) {
          setWsTest(prev => ({ ...prev, message: 'Connected and closed' }));
        }
      };
    } catch (error) {
      setWsTest({ success: false, error: error.message });
    }
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      left: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '20px', 
      borderRadius: '10px',
      zIndex: 9999,
      maxWidth: '400px'
    }}>
      <h3>Connection Test</h3>
      
      <div>
        <strong>Config:</strong>
        <pre style={{ fontSize: '12px', margin: '5px 0' }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
      
      <div>
        <strong>API Test:</strong>
        {apiTest ? (
          <div style={{ color: apiTest.success ? 'green' : 'red' }}>
            {apiTest.success ? '✅ Success' : '❌ Failed'}
            {apiTest.error && <div>Error: {apiTest.error}</div>}
            {apiTest.data && <pre style={{ fontSize: '10px' }}>{JSON.stringify(apiTest.data, null, 2)}</pre>}
          </div>
        ) : (
          <div>Testing...</div>
        )}
      </div>
      
      <div>
        <strong>WebSocket Test:</strong>
        {wsTest ? (
          <div style={{ color: wsTest.success ? 'green' : 'red' }}>
            {wsTest.success ? '✅ Success' : '❌ Failed'}
            {wsTest.error && <div>Error: {wsTest.error}</div>}
            {wsTest.message && <div>{wsTest.message}</div>}
          </div>
        ) : (
          <div>Testing...</div>
        )}
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '12px' }}>
        <strong>Environment Variables:</strong>
        <div>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</div>
        <div>NEXT_PUBLIC_WS_HOST: {process.env.NEXT_PUBLIC_WS_HOST || 'Not set'}</div>
      </div>
    </div>
  );
}
