#EmberCMS 
[Ember.js](http://emberjs.com/) Content Management System

EmberCMS: Meteor meets Ember.js meets a content management system. A fullstack javascript environment that can be setup in minutes, has the flexibility of Ember and Rails but with a single codebase. It's good for: outsourcing, as you only need to find one skill to maintain it; allows you the flexibility to add programmatic features; and gives clients the ability to make content and page changes. Comes with security and saving files to S3 built in (among other features) - so you can be up and running and have that consulting job done in a day.

![EmberCMS](http://designregister.s3.amazonaws.com/own_56b55e2bb6c94c99070d3fb9_o_913fe1ed8d02411b960e59d175c96243_Screenshot+from+2016-01-04+23-48-46.png)


#Notes
* This is a complete fullstack "javascript only" CMS (Sails and Ember)
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

Takes about 30 minutes

##Prerequisites
* Get a machine/virtual machine

* node & npm [https://nodejs.org/en/download/package-manager/]
```
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
```

* mongo [https://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/]
Create a file /lib/systemd/system/mongodb.service with the following content:
```
[Unit]
Description=High-performance, schema-free document-oriented database
After=network.target

[Service]
User=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongodb.conf

[Install]
WantedBy=multi-user.target
```
Then install mongo:
```
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install upstart-sysv
sudo apt-get install -y mongodb-org
sudo service mongod start
```

* redis (for next stages)
```
sudo apt-get install redis-server
sudo apt-get install redis-tools
```
* ember-cli (sudo npm install -g ember-cli)
* sailsjs (sudo npm install sails -g)
* sanestack.com (sudo npm install -g sane-cli@beta)
* Install bower (sudo npm install -g bower)

##Setup the environment

Then go into server directory and run:
```
npm install
```
Then go into client directory and run:
```
npm install
bower install
```
* Get and setup your Amazon s3 account
* This git repo/zipped into a working directory
* ember-cli-materialize (http://mike.works/ember-cli-materialize/#/forms)... this is the only stable material design lite (MDL) implementation in Ember (and I believe I tested all of them), the templating could equally be done in bootstrap but was not what I wanted at the time as the MDL styling support exceeds that of BS (http://www.getmdl.io/styles/index.html)

##Update the site details in:
* /client/config/environment.js 
* /client/app/pods/application/controller.js & etc
 
##Change the templates if you wish:
* /client/app/pods/component/template-*
* /client/app/styles/app.scss

##Setup the plugins on the server (encryption,sendgrid emails, aws s3 photo storage):
* /server/config/[jwt,sendgrid,aws].js

##Setup iptables if you're in docker or behind a firewall
http://serverfault.com/questions/238563/can-i-use-ufw-to-setup-a-port-forward
Note that you will need to make sure port 4200 is allowed, otherwise ufw will block the requests that are redirected to 4200.
```
sudo ufw allow 4200/tcp
sudo ufw allow ssh
sudo ufw allow 80/tcp
```
Add before filter section in /etc/ufw/before.rules(top of file):
```
*nat
:PREROUTING ACCEPT [0:0]
-A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 4200
COMMIT
```

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

##Bugs/Improvements
I may eventually replace the sails-auth/sails-permissions/ember-cli-materialize dependencies with my own github links while the repos are in transition - clone the repos and edit the code if you have to then add something like this if you'd like to update any code immediately Ie. "public": "git://github.com/user/repo.git#ref". Let me know if you'd like me to merge your pull request.

##Useful links
http://mike.works/ember-cli-materialize/#/forms

http://www.getmdl.io/styles/index.html

https://s3.amazonaws.com/kantan-dresssed-demos/demos/ives/blue_preview/007_icons@fa-lightbulb-o%252F004_mdi_icons.html

http://www.feedhenry.com/server-side-pdf-generation-node-js/

http://stackoverflow.com/questions/25582382/sails-js-and-ember-js-nested-associations


##Thanks

...thanks to the many npm packages and source code used to help make this!
 
## Legal

[@andrewgrosser](http://twitter.com/andrewgrosser)

[Licensed under the MIT license](http://www.opensource.org/licenses/mit-license.php)

![EmberCMSR](http://designregister.s3.amazonaws.com/own_56b55e2bb6c94c99070d3fb9_o_43f3a32468884dab8e014de6c98917a6_Screenshot+from+2016-01-04+23-48-15.png)

