import React from 'react';

const SimpleDebugInfo: React.FC = () => {
  const envVars = {
    'VITE_BACKEND_API_URL': import.meta.env.VITE_BACKEND_API_URL,
    'VITE_GEMINI_API_KEY': import.meta.env.VITE_GEMINI_API_KEY ? '***SET***' : 'NOT SET',
    'MODE': import.meta.env.MODE,
    'PROD': import.meta.env.PROD,
    'DEV': import.meta.env.DEV,
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999,
      fontFamily: 'monospace',
      border: '1px solid #333'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>🐛 Debug Info</div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Environment Variables:</strong>
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} style={{ margin: '2px 0' }}>
            <strong>{key}:</strong> {value || 'undefined'}
          </div>
        ))}
      </div>
      <div>
        ✅ React loaded<br/>
        ✅ Main component rendered<br/>
        🔍 Check console for errors
      </div>
    </div>
  );
};

export default SimpleDebugInfo;