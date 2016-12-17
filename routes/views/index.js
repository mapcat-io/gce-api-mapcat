exports = module.exports = function(req, res) {
	// Render the view
	res.sendFile('index.html', { root: 'templates' });
};
