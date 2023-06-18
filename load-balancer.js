const express = require('express');
const app = express();
const port = 4000;

const load_balancer_config = ['http://localhost:4001', 'http://localhost:4002', 'http://localhost:4003', 'http://localhost:4004', 'http://localhost:4005'];
let loadBalancerCounter = 0;

// Catch all requests and distribute load
app.get('*', (req, res) => {
	res.redirect(302, `${load_balancer_config[loadBalancerCounter % 5]}/${req.path}`);
	loadBalancerCounter++;
});

// Starting load balancer
app.listen(port, () => {
	console.log(`Load balancer running on: http://localhost:${port}`);
});
