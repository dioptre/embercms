// set environment variables in production deployments to set secrets
// use from global `sails.config.jwt.secret`
module.exports.jwt = {
  secret: process.env.JWT_SECRET || '**n0t-S0-s3cr3t-K3y!',
  refresh_secret: process.env.JWT_REFRESH_SECRET || 'r3Fr3sh-K3y*!',
  expiration_time_in_minutes: process.env.JWT_EXPIRATION_TIME_IN_MINUTES || 60*2
}
