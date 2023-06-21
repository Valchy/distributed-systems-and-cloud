require('dotenv').config();
const express = require('express');
const app = express();

const port = process.env.APP_PORT || 4444;

console.log('helllooooo');
console.log(process.env);

// Middleware to parse JSON request bodies
app.use(express.json());

function middleware(req, res, next) {
	// Check authorization header
	const authHeader = req.headers.authorization;

	if (authHeader !== 'jesting') res.status(401).json({ error: 'Unauthorized -> provide header authorization!' });
	else next();
}

// Endpoint to get favourite drink
app.get('/api/favourite-drink', middleware, (req, res) => {
	const favouriteDrink = 'espresso';
	res.json({ data: { favouriteCoffee: favouriteDrink }, host: `${req.protocol}://${req.get('host')}` });
});

// Endpoint to post favourite drink
app.post('/api/favourite-drink', middleware, (req, res) => {
	const top3 = req.body.data.top3;
	console.log('Received top 3 drinks:', top3);
	res.json({ message: 'Favourite drink posted successfully', host: `${req.protocol}://${req.get('host')}` });
});

// Endpoint to get leaderboard of favourite drinks
app.get('/api/favourite-drinks-leaderboard', middleware, (req, res) => {
	const top3 = ['espresso', 'cappuccino', 'latte'];
	res.json({ data: { top3 }, host: `${req.protocol}://${req.get('host')}` });
});

// Show API endpoints to any other route
app.get('*', (req, res) => {
	res.json({
		api_routes: ['GET /api/favourite-drink', 'GET /api/favourite-drinks-leaderboard', 'POST /api/favourite-drink'],
		host: `${req.protocol}://${req.get('host')}`
	});
});

// Start the server
app.listen(port, () => {
	console.log(process.env);
	console.log(`Server running on port http://localhost:${port}`);
});
