// snowpack.config.js
module.exports = {
    mount: {
      public: '/',
      src: '/dist',
    },
    plugins: [
      /* ... */
    ],
    routes: [
      /* Redirect all API calls to the Express server */
      {
        "src": "/api/.*",
        "dest": "http://localhost:3000/api"
      }
    ],
    devOptions: {
      port: 8080,
      /* Other options */
    },
  };
  