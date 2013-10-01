YUI.add('uploadPanel', function (Y) {

    var _uploadURL = 'folders/uploadFile';
    
    var datatableOptions = { 
		autoSync: false,		
		//recordType: Y.File,
		columns: [
          {
        	  key : "name",
        	  label : "Name"        	          
          },
          {
        	  key : "size",
        	  label : 'Size'
          },
          {
        	  key : 'bytesUploaded',
        	  label : 'Uploaded',
        	  allowHTML: true
          }
        ]
	};
    
    var uploaderOptions = {    		
            multipleFiles: true,
            enabled : true,
            postVarsPerFile : {
            	basePath : ''
            },
            swfURL: "http://yui.yahooapis.com/3.12.0/build/uploader/assets/flashuploader.swf?t=" + Math.random(),
            uploadURL: "http://yuilibrary.com/sandbox/upload/",
            simLimit: 2,
            withCredentials: false,
            errorAction : Y.Uploader.Queue.CONTINUE
    }
    
    var uploadPanelOptions = {
    		headerContent : "Upload",			
	        centered: true,
	        render  : true,
	        modal : true,
	        visible : false	    		
    };

    Y.UploadPanel = Y.Base.create('uploadPanel', Y.Widget, [], {
    	ATTRS : {
    		panel : {}, 
    		bodyContent : {},    		
    		uploadButton : {},    		
    		uploader : {},
    		datatable : {},
    		type : {},
    		ios : { value : false },
    		uploadDone : { value : false }
    		
    	}, 
    	
    	initializer : function(options) {
    		Y.log("-> initing uploadPanel");
    		Y.log(options);
    		
    		var instance = this;
    		
    		this.set('selectButton', {
    			name : 'selectButton',
    		    value : 'Select',
    		    action: function(e) {
    		        e.preventDefault();
    		        instance.selectFiles();
    		    },

    		    // 'header', 'footer' or Y.WidgetStdMod.HEADER also work here.
    		    section: Y.WidgetStdMod.FOOTER
    		});
    		this.set('uploadButton', {
    			name : 'uploadButton',
    		    value : 'Upload',
    		    action: function(e) {
    		        e.preventDefault();
    		        instance.uploadFiles();
    		    },

    		    // 'header', 'footer' or Y.WidgetStdMod.HEADER also work here.
    		    section: Y.WidgetStdMod.FOOTER
    		});
    		
    		this.set('panel', new Y.Panel(uploadPanelOptions));
    		this.set('datatable', new Y.DataTable(datatableOptions));
    		this.set('bodyContent', new Y.Node.create('<div> </div>'));
    		
    		this.set('uploader', new Y.Uploader(uploaderOptions));
    		
    		this.set('type', Y.Uploader.TYPE);
    		
    		if (Y.UA.ios) {    			
    			this.set('os', true);
    		}
    		
    		
    		
    		
    		Y.log("<- initing uploadPanel");
    	},
    	
    	renderUI : function() {
    		Y.log("-> renderUI uploadPanel");
    		if (this.get('ios')) {
    			this.get('panel').set('bodyContent', "<h2>Upload not available on iOS</h2>");
    		} else {    			
    			this.get('datatable').render(this.get('bodyContent'));    			
    			this.get('panel').set('bodyContent', this.get('bodyContent'));
    		
    			this.get('uploader').render(this.get('bodyContent'));
    			
    			var uploadButtonBoundingBox = new Y.Node.create('<div class="uploadButton"></div>');
    			
    			var uploadButton = new Y.Button({ label : "Upload Files", width : "100%", disabled : true }).render(uploadButtonBoundingBox);
    			this.set('uploadButton', uploadButton);
    			
    			this.get('panel').get('bodyContent').append(uploadButtonBoundingBox);    			
    		}
    		
    		this.get('panel').render();
    		
    		
    		Y.log("<- renderUI uploadPanel");
    	}, 
    	
    	bindUI : function() {
    		Y.log("-> bindUI uploadPanel");
    		var instance = this;
    		
    		var uploadButton = this.get('uploadButton');
    		
    		Y.one('#'+uploadButton.get('id')).on('click', function() {
				
				instance.uploadFiles();
			});
    		
    		
    		var uploader = this.get('uploader');
    		
    		uploader.after('fileselect', function(e) {
    			var fileList = e.fileList;
    			var fileTable = instance.get('datatable');
    			
    			if (this.get('uploadDone')) {
    				uploadDone = false;
    				// empty datatable
    			}
    			
    			Y.each(fileList, function(file){
    				fileTable.addRow(file.getAttrs());
    			});
    			
    			instance.get('panel').centered();
    			
    			instance.get('uploadButton').set('disabled', false);
    		});
    		
    		uploader.on('uploadprogress', function(e) {
    			var file = e.file;
    			var fileTable = instance.get('datatable');
    			
    			var row = instance.getTableRow(file);
    			fileTable.modifyRow(row, { bytesUploaded : e.percentLoaded + "%"});    			
    		});
    		
    		uploader.on('uploadstart', function(e) {
    			uploader.set('enabled', false);
    			instance.get('uploadButton').set('disabled', true);
    		});
    		
    		uploader.on('uploadcomplete', function(e) {
    			var file = e.file;
    			var row = instance.getTableRow(file);
    			var datatable = instance.get('datatable');
    			datatable.modifyRow(row, { bytesUploaded : "100%"});
    			Y.fire('uploadPanel:refreshFolder', true);
    		});
    		
    		uploader.on('alluploadscomplete', function(e){
    			uploader.set('enabled', true);
    			uploader.set('fileList', []);
    			//instance.get('datatable').set(data,[]);
    			instance.set('uploadDone', true);
    			instance.get('uploadButton').set('disabled', false);
    		});
    		
    		uploader.on('uploaderror', function(e){
    			var file = e.file;
    			var row = instance.getTableRow(file);
    			var datatable = instance.get('datatable');
    			datatable.modifyRow(row, { bytesUploaded : 'Not accepted' });
    		});
    		
    		Y.log("<- bindUI uploadPanel");
    	}, 
    	syncUI : function() {
    		Y.log("-> syncUI uploadPanel");
    		
    		Y.log("<- syncUI uploadPanel");
    	},
    	show : function(animation) {
    		Y.log("-> show panel");
    		
    		if (animation) {
    			this.get('panel').show(animation);
    		} else {    			
    			this.get('panel').show();
    		}    	
    	},
    	
    	selectFiles : function() {
    		Y.log("Selecting Files");
    		//this.get('uploader').openFileSelectDialog();
    	},
    	
    	uploadFiles : function() {
    		Y.log("Upload Files");
    		
    		this.get('uploader').uploadAll();
    	},
    	getTableRow : function(file) {
    		var row = null;
    		
    		var datatable = this.get('datatable');
    		
    		Y.each(datatable.data, function(_row) {
    			if (_row.get('name') === file.get('name')) {
    				row = _row;
    			}
    		});
    		
    		return row;
    	},
    	setUploadFolder: function (selectedFolder) {
            //Y.log(selectedFolder.get('path'));
            if (!selectedFolder) {
                alert("Please Select a Folder");
            } else {
                var folder = new Y.Folder({
                    id: 0,
                    name: selectedFolder.get('name'),
                    path: selectedFolder.get('path'),
                    type: selectedFolder.get('type'),
                    hasSubFolders: selectedFolder.get('hasSubFolders')
                });
                folder.set("id", 0);
                this.get('uploader').set('postVarsPerFile', {folder: Y.JSON.stringify(folder) });
            }
        },

	
    });

}, '1.0.0', { requires: ['uploader', 'panel', 'button', 'datatable', 'folder-model', 'event', 'json-stringify']});
