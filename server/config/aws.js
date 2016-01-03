// set environment variables in production deployments to set secrets
// use from global `sails.config.aws.access_key_id`
module.exports.aws = {
  access_key_id: process.env.AWS_ACCESS_KEY_ID || 'AKIAI62DQVNXFMP4S7VQ',
  secret_key: process.env.AWS_SECRET_KEY || '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',
  bucket: process.env.AWS_BUCKET || 'ecms'
}
