exports = module.exports = function(req, res) {
	// Render the view
	res.sendFile('terms.html', { root: 'templates' });
};
