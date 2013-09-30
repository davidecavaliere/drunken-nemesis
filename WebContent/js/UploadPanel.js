YUI.add('uploadPanel', function (Y) {

    var _uploadURL = 'folders/uploadFile';

    Y.UploadPanel = Y.Base.create('uploadPanel', Y.Widget, [], {
    	ATTRS : {
    		
    		
    	}, 
    	
    	initializer : function() {
    		Y.log("-> initing uploadPanel");
    		Y.log(this);
    		
    		Y.log("<- initing uploadPanel");
    	},
    	
    	renderUI : function() {
    		Y.log("-> renderUI uploadPanel");
    		
    		Y.log("<- renderUI uploadPanel");
    	}, 
    	
    	bindUI : function() {
    		Y.log("-> bindUI uploadPanel");
    		
    		Y.log("<- bindUI uploadPanel");
    	}, 
    	syncUI : function() {
    		Y.log("-> syncUI uploadPanel");
    		
    		Y.log("<- syncUI uploadPanel");
    	}
	
    });

}, '1.0.0', { requires: ['uploader', 'panel', 'button', 'datatable', 'folder-model', 'event', 'json-stringify']});
