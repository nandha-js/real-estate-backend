module.exports = {
  apps: [
    {
      name: 'real-estate-api',
      script: './src/server.js', 
      instances: 'max',
      exec_mode: 'cluster',       
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000                
      }
    }
  ]
};
