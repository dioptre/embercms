window.ecms = {};
window.ecms.hasRole = function(roleName) {
	var user = localStorage.getItem('ember_simple_auth:session');
	if (typeof user !== 'string')
		return false;
	user = JSON.parse(user);
	if (typeof user === 'undefined' || !user || typeof user.user === 'undefined' || !user.user || typeof user.user.roles === 'undefined' || !user.user.roles)
		return false;
	return Enumerable.from(user.user.roles).any("$.name === '" + roleName + "'");
};

window.ecms.myUser = function() {
	var user = localStorage.getItem('ember_simple_auth:session');
	if (typeof user !== 'string')
		return null;
	return JSON.parse(user);
};

window.ecms.regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;



