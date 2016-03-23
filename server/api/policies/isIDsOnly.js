var Enumerable = require('linq');

module.exports = function (req, res, next) {
	keys = Object.keys(req.allParams());
	if (Enumerable.from(keys).where("$ !== 'ids' && $ !== 'id'").any())
		return res.status(403).json({ error: 'Only ids filterable' });
	next();
};
