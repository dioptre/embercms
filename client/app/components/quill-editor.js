/* globals Quill */
import Ember from 'ember';

var run = Ember.run;

export default Ember.Component.extend(Ember.Evented, {
  _uuid : function () {
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c==='x'?r:r&0x3|0x8;return v.toString(16);});
    this.set('uuid', uuid);
  }.on('init'),
  uuid: '',
  editor: null,
  body: null,
  body_prev : null,
  context: null,
  _context_changed: function () {
    console.log('hey');
    var b = this.get('body'); 
    if (typeof b === 'string' && b !== this.get('body_prev')) {
	this.get('editor').setHTML(b);
    }
    else if (!b) {
	var empty = '<div></div>';
	this.set('body_prev',empty);
	this.set('body',empty);
	this.get('editor').setHTML(empty);
    }
  }.observes('context'),
  parseHelper: Ember.inject.service('parse-helper'),
  currentRange: null,

  quillEditorId: function(){
    return this.get('uuid') + this.get('elementId') + '_quillEditor';
  }.property('elementId'),


  didInsertElement: function(){
    console.log('didInsertElement');
    var quill = new Quill('#full-editor', {
          modules:  {
            'toolbar': { container: '#full-toolbar' },
            'link-tooltip': true,
	          'image-tooltip': true
          },
          theme: 'snow'
        });

    this.set('editor', quill);
    var b = this.get('body'); 
    if (typeof b === 'string') {
	this.get('editor').setHTML(b);
    }
    this.get('editor').on('text-change', run.bind(this, 'textChange'));
    this.get('editor').on('selection-change', run.bind(this, 'selectionChange'));

  },

  textChange: function(delta, source){
    this.set('body', this.get('editor.editor.innerHTML'));
    console.log('textChange');
    console.log(delta);
    console.log(source);

    if (source === 'api') {
      console.log("An API call triggered this change.");
    } else if (source === 'user') {
      // console.log("A user action triggered this change.");

      //something here to trigger auto save with debouce

    }

  },
  selectionChange: function(range) {
    // console.log('selectionChange');

    this.set('currentRange', range);

  },

  setRange: function(range){
    this.get('editor').setSelection(range);

  }

});
