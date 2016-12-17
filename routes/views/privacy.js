exports = module.exports = function(req, res) {
	// Render the view
	res.sendFile('privacy.html', { root: 'templates' });
};
