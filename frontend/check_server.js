const http = require('http');

function checkServer() {
  console.log('Checking if frontend server is running at http://localhost:3000...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    timeout: 5000 // 5 seconds timeout
  };

  const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('Frontend server is running!');
        console.log('Response received (first 100 chars):', data.substring(0, 100));
      } else {
        console.log(`Frontend server returned status code: ${res.statusCode}`);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Failed to connect to the frontend server. Make sure it\'s running.');
    console.error('Error details:', error.message);
  });

  req.on('timeout', () => {
    console.error('Request timed out after 5 seconds');
    req.destroy();
  });

  req.end();
  console.log('Request sent, waiting for response...');
}

checkServer(); 
