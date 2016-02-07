import Ember from 'ember';
import EmberValidations, { validator } from 'ember-validations';
import Company from 'client/pods/company/controller'

export default Company.extend(EmberValidations, {
	queryParams: ['tab', 'company'],
	tab: '0',	
	tabs: [ 
		{id: '0', title: 'Business'},
        	{id: '1', title: 'Employees'}, 
		{id: '2', title: 'Projects'},
		{id: '3', title: 'Review'},

	],
	isBusiness: function () {
		return this.get('tab') === '0';
	}.property('tab'),
	isEmployees: function () {
		return this.get('tab') === '1';
	}.property('tab'),
	isProjects: function () {
		return this.get('tab') === '2';
	}.property('tab'),
	isReview: function () {
		return this.get('tab') === '3';
	}.property('tab'),
	modalEmplyeeIsOpen: false,
	modalProjectIsOpen: false,
	actions: {
		debug: function() {
			this.Messenger.post({
			  message: "Debug",
			  hideAfter: 10,
			  hideOnNavigate: true
			});
		},
		save: function () {
			var _this = this;
			var m = this.get('model.currentMember');
			if (typeof m !== 'undefined' && m) {

				_this.get('model').save().then(function (saved) {
					m.save().then( function (saved) {
						_this.Messenger.post({
						  message: "Company Saved",
						  hideAfter: 10,
						  hideOnNavigate: true
						});
					});
				});
				_this.send('continue');
			}
		},
		continue: function() {
			this.set('tab', Number(this.get('tab')) + 1);
		},
		restart: function(err) {
			if (/Practice/i.test(err))
				this.set('tab',1);
			else
				this.set('tab', 0);
		},
		showDetail: function() {
			this.transitionTo('company.detail', this.get('model.id'))
		},
		modalEmployeeOpen: function(id) {
			if (!id)
				this.set('model.selectedMemberId', Math.random());
			else 
				this.set('model.selectedMemberId', id);
			this.set('modalEmployeeIsOpen', true);
			Ember.$("head").append('<style type="text/css"></style>');
			var newStyleElement = Ember.$("head").children(':last');
			newStyleElement.html('.modal{height:70%;}');
		},
		modalEmployeeClose: function() {
			this.send('modalEmployeeSave');
		},
		modalEmployeeSave: function() {
			var _this = this;
			var original = this.store.peekRecord('membership', this.get('model.selectedMemberId'));
			var isNew = original.get('isNew');
			//_this.store.unloadRecord(original);
			original.save().then( function (saved) {
				if (isNew) {
					_this.store.unloadRecord(original);
					_this.get('model.memberships').removeObject(original);
				}
				_this.set('model.selectedMemberId', saved.id);
				_this.Messenger.post({
				  message: "Employee Saved",
				  hideAfter: 10,
				  hideOnNavigate: true
				});
			});	

			Ember.$("head").append('<style type="text/css"></style>');
			var newStyleElement = Ember.$("head").children(':last');
			newStyleElement.html('.modal{height:30%;}');
			this.set('modalEmployeeIsOpen', false);
		},
		modalEmployeeDelete: function(id) {
			var _this = this;
			var original = this.store.peekRecord('membership', id);
			if (typeof original.get('user') !== 'string') {
				original.destroyRecord().then(function () {
					_this.Messenger.post({
					  message: "Employee Deleted",
					  hideAfter: 10,
					  hideOnNavigate: true
					});
				});
			} else {
				_this.Messenger.post({
				  message: "Employee not deleted (can't delete company owner).",
				  hideAfter: 10,
				  hideOnNavigate: true
				});		
			}
		},
		modalProjectPhotosDelete: function (projectid, photo) {
			var leftovers = this.get('model.selectedProject.photos').filter(function (m) { return m !== photo; });
			this.set('model.selectedProject.photos', leftovers);
		},
		modalProjectOpen: function(id) {
			if (!id)
				this.set('model.selectedProjectId', Math.random());
			else {
				var m = this.store.peekRecord('project', id);
				if(m)
					m.reload();
				this.set('model.selectedProjectId', id);
			}
			this.set('modalProjectIsOpen', true);
			Ember.$("head").append('<style type="text/css"></style>');
			var newStyleElement = Ember.$("head").children(':last');
			newStyleElement.html('.modal{height:70%;}');
		},
		modalProjectClose: function() {
			this.send('modalProjectSave');
		},
		modalProjectSave: function() {
			var _this = this;
			var original = this.store.peekRecord('project', this.get('model.selectedProjectId'));
			var isNew = original.get('isNew');
			original.save().then( function (saved) {
				if (isNew) {
					_this.store.unloadRecord(original);
					_this.get('model.projects').removeObject(original);
				}
				_this.set('model.selectedProjectId', saved.id);
				_this.Messenger.post({
				  message: "Project Saved",
				  hideAfter: 10,
				  hideOnNavigate: true
				});
			});	

			Ember.$("head").append('<style type="text/css"></style>');
			var newStyleElement = Ember.$("head").children(':last');
			newStyleElement.html('.modal{height:30%;}');
			this.set('modalProjectIsOpen', false);
		},
		modalProjectDelete: function(id) {
			var _this = this;
			var original = this.store.peekRecord('project', id);
			original.destroyRecord().then(function () {
				_this.Messenger.post({
				  message: "Project Deleted",
				  hideAfter: 10,
				  hideOnNavigate: true
				});
			});
		},		
	},
	
	errorExists : true,
	_errorExists : function () { 
		var _this = this;
		Ember.run.scheduleOnce('afterRender', this, function(){
			var check = function() { 
				var found = _this.get('validators').find(function (m) {
					return m.get('errors.length') > 0
				});
				if (typeof found !== 'undefined')
					_this.set('errorExists',true)
				else 
					_this.set('errorExists',false);
			};
			var update = function () {
				check();
				_this.get('validators').map(function (m) { 
					m.get('errors').addArrayObserver({arrayWillChange : function() {}, arrayDidChange : check });
				});							    	
			};
			this.validate().then(update,update); 
		});
	}.on('init'),
	errorExistsTitle: function () { return this.get('errorExists') ? "Review" : "All Done"}.property('errorExists'),
	validations: {
		'model.name' : {
			presence: { message: 'Business/Practice name must not be blank' },
		},
	},
});
