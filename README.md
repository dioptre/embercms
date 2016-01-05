#Setup

##Update the site details in:
 /client/config/environment.js 
 /client/app/pods/application/controller.js & etc
 
##Change the templates if you wish:
 /client/app/pods/component/template-*

##Setup the server (encryption,sendgrid emails, aws s3 photo storage):
 /server/config/[jwt,sendgrid,aws].js
##Setup iptables if you're in docker or behind a firewall
 iptables -t nat -A PREROUTING -p tcp -d 10.240.0.3 --dport 80 -j DNAT --to-destination 10.240.0.3:4200 iptables -t nat -A POSTROUTING -j MASQUERADE

##There might be a dead dependency in the optional sails stats module sails-hook-dev 
 vi server/node_modules/sails-hook-dev/index.js and replace lodash.... with lodash').isObject & reduce

##Login to your site
 run "npm install" in /client and /server
 run "bower install" in /client and /server
 run "sane up" in /
 login to localhost:4200 as admin/admin1234
 create a page "home" under localhost:4200/admin
 create sections for page content etc.
 
 
