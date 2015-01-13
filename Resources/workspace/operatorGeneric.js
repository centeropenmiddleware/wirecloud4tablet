/*
 * Copyright (c) 2014 CoNWeT Lab., Universidad Politecnica de Madrid.
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

//Widget Generic Component Constructor

function operatorGeneric(parameters, idOperator, userName) {

	var _isApple = (Ti.Platform.osname == 'ipad');
	var _self;
	var _routeHTML = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, Yaast.Sandbox.instanceDir + userName + '/operators/' + parameters.uri + '/index.html');
	_self = Ti.UI.createWebView({
		url : _routeHTML.nativePath,
		width : 0,
		height : 0,
		top : 0,
		left : 0,
		flag : true,
		visible : false
	});
	_self.funPlatformInfo = function funPlatformInfo() {
		_self.evalJS("MashupPlatform.setPlatformInfo(" + idOperator + "," + "'operator'" + ");");
	};
	_self.clearObject = function clearObject() {
		_self.removeEventListener('load', _self.funPlatformInfo);
		delete _self['funPlatformInfo'];
		_isApple = null;
	};
	_self.addEventListener('load', _self.funPlatformInfo);
	_routeHTML = null;
	return _self;
}

module.exports = operatorGeneric;
