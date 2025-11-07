import React, { useEffect, useState } from 'react';

const HealthCheck = () => {
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/health`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.status === 'healthy') {
          setStatus('Backend is healthy');
        } else {
          setStatus('Backend health check failed');
        }
      })
      .catch(() => {
        setStatus('Backend is unreachable');
      });
  }, []);

  return (
    <div className="health-check">
      <p>{status}</p>
    </div>
  );
};

export default HealthCheck;