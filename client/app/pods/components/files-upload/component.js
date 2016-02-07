import Ember from 'ember';
import EmberUploader from 'ember-uploader';

export default EmberUploader.FileField.extend({
  uploadBusy : false,
  uploadedUrls : [],
  url: '/upload',
  multiple: true,
  filesUploaded: 0,
  filesToUpload: 0,
  filesDidChange: function(files) {
	    var uploadUrl = this.get('url');
	    var _this = this;
	    _this.set('filesUploaded', 0);

	    var uploader = EmberUploader.S3Uploader.create({
	      url: uploadUrl
	    });

	    uploader.on('didUpload', function(response) {
	      // S3 will return XML with url
	      var uploadedUrl = $(response).find('Location')[0].textContent;
	      uploadedUrl = decodeURIComponent(uploadedUrl); // => http://yourbucket.s3.amazonaws.com/file.png
	      var arr = _this.get('uploadedUrls');		
	      arr.pushObject(uploadedUrl)
	      _this.set('uploadedUrls', arr);
	      _this.set('filesUploaded', _this.get('filesUploaded') + 1);
	      if (_this.get('filesUploaded') >= _this.get('filesToUpload')) {
		_this.set('filesToUpload', 0);
		_this.set('filesUploaded', 0);
		_this.set('uploadBusy', false);
	      }
	    });

	    uploader.on('didError', function(jqXHR, textStatus, errorThrown) {
	      // Handle unsuccessful upload
		_this.set('filesToUpload', 0);
	    	_this.set('uploadBusy', false);
	    });

	    if (!Ember.isEmpty(files)) {
		var l = files.length;
		if (l > 0) {
			_this.set('uploadBusy', true);
			_this.set('filesToUpload', l);			
		}
	      	for (var i = 0; i < files.length; i++) {
			if (/\.(png|jpg|jpeg)$/i.test(files[i].name)) {
				if (typeof window.URL.createObjectURL !== 'function') {
					_this.container.lookup('route:application').Messenger.post({
					  message: "Unsupported browser. Please upload on a browser newer than 2012.",
					  hideAfter: 10,
					  hideOnNavigate: true
					});
					break;
				}
				
				var img = new Image();
				img.index = i;
				img.src = window.URL.createObjectURL( files[i] );
				img.onload = function() {
				    var width = img.naturalWidth,
					height = img.naturalHeight;
				    window.URL.revokeObjectURL( img.src );
				    if( width < 4800 && height < 4800 && files[this.index].size < 3000000 ) {
					uploader.upload(files[this.index], {lastModified : files[this.index].lastModified, width : width, height: height});
				    }
				    else {
					//fail
					_this.container.lookup('route:application').Messenger.post({
					  message: "Image too large, try reducing the image size (" + files[this.index].name + ")",
					  hideAfter: 10,
					  hideOnNavigate: true
					});
				    }

				};
			}
			else {
				_this.container.lookup('route:application').Messenger.post({
				  message: "Skipping unsupported file (" + files[i].name + ") types supported are png, jpg, jpeg.",
				  hideAfter: 10,
				  hideOnNavigate: true
				});
				//uploader.upload(img.file
			}
			


		};
	    }
  }
});
