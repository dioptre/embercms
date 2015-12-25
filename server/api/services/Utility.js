/**
 * api/services/Utitlity.js
 *
 * @module        Service
 * @name          Utility
 * @memberOf      global
 * @description   Utilities for various common tiny tasks
 * @docs          http://sailsjs.org/#!documentation/services
 * @api           public
 **/

/**
 * Module dependencies
 */
  var util = require('util'),
      _ = require('lodash');

module.exports = {

  getRequestAction: function (req) {
    if (req.options.action) return req.options.action;

    var controller = req.options.controller || req.options.model;

    var baseRoute = sails.config.blueprints.prefix + controller;
    var requestRoute = req.route.method + ' ' + req.route.path;

    var Model = sails.models[controller];

    if (req.options.shortcuts && Model) {
      var shortcutRoutes = {
        '/%s/find/:id?': 'find',
        '/%s/create': 'create',
        '/%s/update/:id?': 'update',
        '/%s/destroy/:id?': 'destroy'
      };

      var shortcutAction = _.findWhere(shortcutRoutes, function(blueprint, pattern){
        var shortcutRoute = util.format(pattern, baseRoute);
        return req.route.path === shortcutRoute;
      });

      if (shortcutAction) return shortcutAction;
    }

    if (req.options.rest && Model) {
      var restRoutes = {
        'get /%s/:id?': 'find',
        'post /%s': 'create',
        'put /%s/:id?': 'update',
        'delete /%s/:id?': 'destroy'
      };

      var restAction =_.findWhere(restRoutes, function(blueprint, pattern){
        var restRoute = util.format(pattern, baseRoute);
        return requestRoute === restRoute;
      });

      if (restAction) return restAction;

      var associationActions = _.compact(_.map(req.options.associations, function(association){
        var alias = association.alias;

        var associationRoutes = {
          'get /%s/:parentid/%s/:id?': 'populate',
          'post /%s/:parentid/%s': 'add',
          'delete /%s/:parentid/%s': 'remove'
        };

        return _.findWhere(associationRoutes, function(blueprint, pattern){
          var associationRoute = util.format(pattern, baseRoute, alias);
          return requestRoute === associationRoute;
        });
      }));

      if (associationActions.length > 0) return associationActions[0];
    }
  }
};
