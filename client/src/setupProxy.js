const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://tuserapi.vercel.app',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    })
  );

  app.use(
    '/finalapi',
    createProxyMiddleware({
      target: 'https://finalbakend.vercel.app',
      changeOrigin: true,
      pathRewrite: { '^/finalapi': '' },
    })
  );
};
