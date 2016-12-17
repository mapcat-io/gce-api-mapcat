exports = module.exports = function(req, res) {
  // Render the view
  res.sendFile('dcma.html', { root: 'templates' });
};
