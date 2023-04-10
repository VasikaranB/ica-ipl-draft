const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');



// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com";

// Logging
app.use(morgan('dev'));

// CORS
app.use(cors());

// Info GET endpoint
app.get('/info', (req, res, next) => {
    res.send('This is a proxy service which proxies to Billing and Account APIs.');
 });

 
 // Authorization
app.use('', (req, res, next) => {
        next();
 });
 
 // Proxy endpoints
app.use('/api', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/api`]: '',
    },
 }));

 // Start the Proxy
app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
 });
 