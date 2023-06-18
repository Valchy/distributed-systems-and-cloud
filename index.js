const express = require('express');
const app = express();
const port = 4000;

// Middleware to parse JSON request bodies
app.use(express.json());

function middleware(req, res, next) {
	// Check authorization header
	const authHeader = req.headers.authorization;

	if (authHeader !== 'jesting') res.status(401).json({ error: 'Unauthorized' });
	else next();
}

// Endpoint to get favourite drink
app.get('/api/favourite-drink', middleware, (req, res) => {
	const favouriteDrink = 'espresso';
	res.json({ data: { favouriteCoffee: favouriteDrink } });
});

// Endpoint to post favourite drink
app.post('/api/favourite-drink', middleware, (req, res) => {
	const top3 = req.body.data.top3;
	console.log('Received top 3 drinks:', top3);
	res.json({ message: 'Favourite drink posted successfully' });
});

// Endpoint to get leaderboard of favourite drinks
app.get('/api/favourite-drinks-leaderboard', middleware, (req, res) => {
	const top3 = ['espresso', 'cappuccino', 'latte'];
	res.json({ data: { top3 } });
});

// Show API endpoints to any other route
app.get('*', (req, res) => {
	res.json({
		api_routes: ['GET /api/favourite-drink', 'GET /api/favourite-drinks-leaderboard', 'POST /api/favourite-drink']
	});
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on port http://localhost:${port}`);
});
