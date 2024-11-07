import { createProxyMiddleware } from 'http-proxy-middleware';

export default createProxyMiddleware({
  target: 'https://finalbakend.vercel.app', // URL sax ah
  changeOrigin: true,
  pathRewrite: { '^/finalapi': '' },
});

export const config = {
  api: { bodyParser: false },
};
