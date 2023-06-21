require('dotenv').config();
const express = require('express');

const app = express();
const port = 4000;

const load_balancer_config = process.env.HOSTS.split(',');
let loadBalancerCounter = 0;

if (load_balancer_config.length === 0) {
	return console.log('Please provide load balance hosts\nExample: node load-balancer.js http://18.195.253.24 http://3.73.56.149');
} else console.log('Load balancer started with given config:\n', load_balancer_config);

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
