#EmberCMS 
[Ember.js](http://emberjs.com/) Content Management System

![EmberCMS](http://ecms.s3.amazonaws.com/pub_568b81391ae7569716b25d17_9515a3ab6ce843e88cf03f08c0a863c0_Screenshot+from+2016-01-04+23-48-15.png)


#Notes
* This is a complete fullstack "javascript only" CMS
* It's fairly basic at this stage, and is intended for users who are building applications in Ember.js to give their clients admin rights over content without needing to edit code while giving the developers the power to concentrate on app-building.
* Should be good for developers who want to pass over a site to outsourcers who are only/experts familiar with javascript
* Should be good for people who want to become experts at javascript full-stack
* Should be a fantastic introduction to Ember & Sails (javascript/node.js alternative to Rails)
* I built this for myself and contracting gigs around small app development (> squarespace < complete custom job) - but please contact me at dioptre@gmail.com if you want me to help you too
* The images in this helpfile were uploaded with EmberCMS :)

## Missing
* Adding photos to content is a little manual - and should be improved
* Caching page content in Redis is a todo
* Stub for internationalization (translations) is there
* Analytics (look at applicationroute), but should go with something like https://github.com/ember-insights/ember-insights
* **You can open up editing of your other existing models too** using /client/app/services/admin.js
* Custom renderers for components (only raw html is being rendered of section.description atm), stubs are there to do other "types"
* Dropdowns in admin interface (Eg. theme in page can be "indigo" or other colors: http://mike.works/ember-cli-materialize/#/colors) but there are no drop downs for this yet

#Setup

##Prerequisites
* node & npm
* mongo & redis (for next stages)
* ember-cli (npm install -g ember-cli)
* sailsjs (npm install sails -g)
* sanestack.com (npm install -g sane-cli@beta)
* Amazon s3 account
* This git repo/zipped into a working directory
* ember-cli-materialize (http://mike.works/ember-cli-materialize/#/forms)... this is the only stable material design lite (MDL) implementation in Ember (and I believe I tested all of them), the templating could equally be done in bootstrap but was not what I wanted at the time as the MDL styling support exceeds that of BS (http://www.getmdl.io/styles/index.html)

##Update the site details in:
* /client/config/environment.js 
* /client/app/pods/application/controller.js & etc
 
##Change the templates if you wish:
* /client/app/pods/component/template-*
* /client/app/styles/app.scss

##Setup the server (encryption,sendgrid emails, aws s3 photo storage):
* /server/config/[jwt,sendgrid,aws].js

##Setup iptables if you're in docker or behind a firewall
* iptables -t nat -A PREROUTING -p tcp -d 101.140.0.1 --dport 80 -j DNAT --to-destination 101.140.0.1:4200 iptables -t nat -A POSTROUTING -j MASQUERADE

##Setup Amazon
* Setup IAM account that has s3 and lambda full access
* Create a "bucket1" and "bucket1resized" bucket
* Zip /aws/lambda to /aws/lambda.zip
* Upload /aws/lambda.zip to AWS lambda
* Follow /aws/readme.md for next steps for adding CORS and other permissions
* Setup in s3 that on object create execute lambda

##Login to your site
1. run "npm install" in /client and /server
2. run "bower install" in /client and /server
3. run "sane up" in /
4. login to localhost:4200 as admin/admin1234
5. create a page "home" under localhost:4200/admin
6. create sections for page content etc. and fill up your site
7. if you want to extend your own site with custom code, check out /client/app/pods/components/template-header/template.hbs and /client/app/pods/s/company...

##Thanks

...thanks to the many npm packages and source code used to help make this!
 
## Legal

[@andrewgrosser](http://twitter.com/andrewgrosser)

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)

![EmberCMSR](http://ecms.s3.amazonaws.com/pub_568b814f1ae7569716b25d19_e08d5cf186804b599124f03e7dc6fc9d_Screenshot+from+2016-01-04+23-48-46.png)

