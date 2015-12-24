/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'client',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    podModulePrefix: 'client/pods',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    sassOptions: {
      includePaths: ['bower_components/materialize/sass']
    }
  };


  ENV.contentSecurityPolicy =  {
          'default-src': "'self' https://maps.googleapis.com http://localhost",
          'font-src': "'self' *",
          'connect-src': "'self' https://maps.googleapis.com ws://localhost:35729 ws://localhost:4200",
          'img-src': "*",
          'style-src': "* 'unsafe-inline'",
          'frame-src': "*",
          'script-src': "'self' 'unsafe-eval' 'unsafe-inline' *.googleapis.com *.gstatic.com localhost:35729 *.stripe.com https://js.stripe.com localhost:49152 maps.google.com"
  };


  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
