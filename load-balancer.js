require('dotenv').config();
const express = require('express');
const s3 = require('./s3');

const app = express();
const port = 4000;

// Get configuration from S3 bucket or use .env as backup
let load_balancer_config;
let loadBalancerCounter = 0;
(async () => {
	try {
		const jsonData = await s3();
		load_balancer_config = jsonData.hosts;

		if (load_balancer_config.length === 0) {
			return console.log('Please provide load balance hosts\nExample: node load-balancer.js http://18.195.253.24 http://3.73.56.149');
		} else console.log('Load balancer started with given config:\n', load_balancer_config);
	} catch (err) {
		console.log('S3 error occured and default .env hosts were used!');
		load_balancer_config = process.env.HOSTS.split(',');
	}
})();

// Catch all requests and distribute load
app.get('*', (req, res) => {
	// Health check for load balancer
	if (req.path === '/load-balancer-health-check') return res.send('OK');

	// Pass all headers to the redirect destination
	Object.keys(req.headers).forEach(header => {
		res.setHeader(header, req.headers[header]);
	});

	// Doing redirect
	res.redirect(302, `${load_balancer_config[loadBalancerCounter % load_balancer_config.length]}${req.path}`);
	loadBalancerCounter++;
});

// Starting load balancer
app.listen(port, () => {
	console.log(`Load balancer running on: http://localhost:${port}`);
});
