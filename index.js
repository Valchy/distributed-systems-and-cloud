require('dotenv').config();
const express = require('express');

// API DB Functions
const { getFavCoffee, getCoffeeLeaderboard, saveFavCoffee } = require('./database');

const app = express();
const port = 4444;

// Middleware to parse JSON request bodies
app.use(express.json());

// Authorization middleware
function middleware(req, res, next) {
	// Check authorization header
	const authHeader = req.headers.authorization;

	if (authHeader !== 'jesting') res.status(401).json({ error: 'Unauthorized -> provide header authorization!' });
	else next();
}

// Endpoint to get favourite coffee
app.get('/api/favourite-coffee', middleware, (req, res) => {
	getFavCoffee(favouriteCoffee => {
		res.json({ data: { favouriteCoffee }, host: `${req.protocol}://${req.get('host')}` });
	});
});

// Endpoint to get leaderboard of favourite coffees
app.get('/api/favourite-coffees-leaderboard', middleware, (req, res) => {
	getCoffeeLeaderboard(coffeeLeaderboard => {
		res.json({ data: { coffeeLeaderboard }, host: `${req.protocol}://${req.get('host')}` });
	});
});

// Endpoint to post favourite coffee
app.post('/api/favourite-coffee', middleware, (req, res) => {
	const favCoffee = req.body.data.favCoffee;

	// Error handling
	if (!favCoffee) return res.status(400).json({ error: 'No favourite coffee provided!', host: `${req.protocol}://${req.get('host')}` });

	// Save favourite coffee to db
	saveFavCoffee(favCoffee, saveSuccess => {
		// Return success / failure json
		if (saveSuccess) res.json({ message: `Favourite coffee "${favCoffee}" posted successfully`, host: `${req.protocol}://${req.get('host')}` });
		else res.status(400).json({ error: 'Problem saving favourite coffee', host: `${req.protocol}://${req.get('host')}` });
	});
});

// Show API endpoints to any other route
app.get('*', (req, res) => {
	res.json({
		api_routes: [
			'GET /api/favourite-coffee',
			'GET /api/favourite-coffees-leaderboard',
			'POST /api/favourite-coffee (body: { data: { favCoffee :"coffee string" } })'
		],
		host: `${req.protocol}://${req.get('host')}`
	});
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on port http://localhost:${port}`);
});
