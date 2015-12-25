import Ember from 'ember';
import EmberUploader from 'ember-uploader';

export default EmberUploader.FileField.extend({
  uploadBusy : false,
  uploadedUrl : '',
  url: '',
  filesDidChange: function(files) {
	    var uploadUrl = this.get('url');
	    var _this = this;
	    _this.set('uploadBusy', true);
	    var uploader = EmberUploader.S3Uploader.create({
	      url: uploadUrl
	    });

	    uploader.on('didUpload', function(response) {
	      // S3 will return XML with url
	      var uploadedUrl = $(response).find('Location')[0].textContent;
	      uploadedUrl = decodeURIComponent(uploadedUrl); // => http://yourbucket.s3.amazonaws.com/file.png
	      _this.set('uploadedUrl', uploadedUrl);
	      _this.set('uploadBusy', false);
	    });

	    uploader.on('didError', function(jqXHR, textStatus, errorThrown) {
	      // Handle unsuccessful upload
		alert('Failed to upload document');
	    	_this.set('uploadBusy', false);
	    });

	    if (!Ember.isEmpty(files)) {
	      uploader.upload(files[0]); // Uploader will send a sign request then upload to S3
	    }
  }
});
