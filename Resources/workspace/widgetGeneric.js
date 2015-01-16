/*
 * Copyright (c) 2014 CoNWeT Lab., Universidad Politecnica de Madrid.
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */


//Widget Generic Component Constructor

function widgetGeneric(dim, parameters, idWidget, userName) {

	var _isApple = (Ti.Platform.osname == 'ipad');
	var _self;
	var mainhtmlName = parameters.meta.contents.src;
	var mac_path = Yaast.Sandbox.instanceDir + userName + '/widgets/' + parameters.meta.uri + '/';
	var mainHTML = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mac_path + mainhtmlName);
	var instanceHTML = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mac_path + mainhtmlName + "." + idWidget + ".html");
	var payloadFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mac_path + mainhtmlName + "." + idWidget + ".payload.js");
	var payload = {
		type: "widget",
		id: idWidget,
		meta: parameters.meta,
		preferences: parameters.preferences,
		properties: parameters.properties,
		appleOS: _isApple
	};
	payloadFile.write("window._payload = " + JSON.stringify(payload), false);

	if (!instanceHTML.exists()) {
		var _fileMashupPlatform = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mac_path + 'wiringPlatform.js');
		var _textMashupOriginal = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'workspace/wiring/wiringPlatformJS.lib').read().toString();
		var _fileBridge = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mac_path + 'APIBridge.js');
        var _textBridgeOriginal = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), 'workspace/APIBridge/APIBridgeJS.lib').read().toString();
		_fileMashupPlatform.write(_textMashupOriginal, false);
		_fileBridge.write(_textBridgeOriginal, false);
		_textMashupOriginal = null;
		_fileMashupPlatform = null;
		_fileBridge = null;
		_fileMashupPlatform = null;

		var _textHTML = mainHTML.read().toString();
		var _routeMashup = '<head>\n';
		_routeMashup += '\t\t<script type="text/javascript" src="' + mainhtmlName + "." + idWidget + ".payload.js" + '"></script>\n';
		_routeMashup += '\t\t<script type="text/javascript" src="wiringPlatform.js"></script>\n'; 
		_routeMashup += '\t\t<script type="text/javascript" src="APIBridge.js"></script>\n';
		_textHTML = _textHTML.replace('<head>', _routeMashup);
		instanceHTML.write(_textHTML, false);
		_routeMashup = null;
		_textHTML = null;
	}
	_self = Ti.UI.createWebView({
		url: instanceHTML.nativePath,
		width: dim.width,
		height: dim.height,
		touchEnabled : true,
		flag : true
	});

	_self.clearObject = function clearObject() {
		// Nothing to do
	};

	if (_isApple) {
	    _self.setDisableBounce(true);
	} else {
	    _self.setOverScrollMode(Ti.UI.Android.OVER_SCROLL_NEVER);
	    _self.setEnableZoomControls(false);
	}
	_isApple = null;
	mainhtmlName = null;
	mac_path = null;
	mainHTML = null;
	instanceHTML = null;
	payloadFile = null;
	payload = null;

	_self.setTop(dim.top);
	_self.setLeft(dim.left);
	_self.setBorderColor("#E3DEDD");
	_self.setBorderWidth(1);
	return _self;
}

module.exports = widgetGeneric;