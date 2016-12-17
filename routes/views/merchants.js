exports = module.exports = function(req, res) {
	// Render the view
	res.sendFile('merchants.html', { root: 'templates' });
};
