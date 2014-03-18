/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.2.2GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var mainViewDetailStyle = (function() {

    var _self = {},
    heightView = (Ti.App.API.HW.System.isApple()) ?
                  Ti.App.API.HW.System.getPlatformHeight() - 20 :
                  Ti.App.API.HW.System.getPlatformHeight(),
    rowHeight =  (Ti.App.API.HW.System.isApple()) ? 44 : '48dp',
    rowFontSize = (Ti.App.API.HW.System.isApple()) ? '20' : '18dp';

    _self.view = {
        left: Ti.App.API.HW.System.getPlatformWidth() * 0.3,
        width: Ti.App.API.HW.System.getPlatformWidth() * 0.7,
        height: heightView,
        top: rowHeight,
        backgroundColor: '#4F6C88'
    };
    _self.view.height -= (Ti.App.API.HW.System.isApple()) ? rowHeight + 1 : rowHeight;
    _self.view.top += (Ti.App.API.HW.System.isApple()) ? 1 : 0;

    return _self;

}());

module.exports = mainViewDetailStyle;

