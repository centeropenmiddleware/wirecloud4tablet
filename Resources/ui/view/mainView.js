
/**
 * Copyright (c) 2014 by Center Open Middleware. All Rights Reserved.
 * Titanium Appcelerator 3.3.0GA
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */

"use strict";

var mainView = function mainView(parentWindow, userName) {
	Ti.API.info('----Loading MainView');
	var _isApple = Yaast.API.HW.System.isApple();
    // Create References
    var theme = require('ui/style/mainViewStyle');
    var topBar = Ti.UI.createView(theme.topBar);
    var wirecloudLogo = Ti.UI.createWebView(theme.logo);
    var buttonLogout = Ti.UI.createLabel(Yaast.MergeObject(theme.button, {
        left: (_isApple) ? 14 : 12,
        text: Yaast.FontAwesome.getCharCode('fa-sign-out')
    }));
    var buttonStore = Ti.UI.createLabel(Yaast.MergeObject(theme.button, {
        left: (_isApple) ? 14 : 12,
        text: Yaast.FontAwesome.getCharCode('fa-cloud')
    }));
    var leftView = Ti.UI.createView(theme.leftView);
    var rightView = Ti.UI.createView(theme.rightView);

	// TODO no se usa esta view... supongo que era para el spinner
    var shadowView = Ti.UI.createView(theme.leftShadowView);
    var _self = {
        compositions : {},
        detailView : null,
        view : Ti.UI.createView(theme.view),
        parentView: parentWindow
    };

    // Bind click ListView
    _self.clickRowListView = function clickRowListView(e) {
    	Ti.API.info('e.section.getItemAt(e.itemIndex).id.text: ' + e.section.getItemAt(e.itemIndex).id.text);
        _self.showDetailView(e.section.getItemAt(e.itemIndex).id.text);
    };

	// Add click event into listView
	theme.leftListViewTemplate.events = {click: _self.clickRowListView};
    var leftListView = Ti.UI.createListView({
        templates: {
            'template':theme.leftListViewTemplate
        },
        defaultItemTemplate: 'template'
    });

	var createHeaderView = function createHeaderView() {
	    var view = Ti.UI.createLabel(theme.headerlabelView);
	    return view;
	};

	_self.createWorkspaceLink = function createWorkspaceLink(data) {
		// TODO change it after fix shared attr bug
		if (data.owned && !data.shared) {
			// User Workspace
			Ti.API.info('TODO User Workspace: ' + JSON.stringify(data));
		} else if (data.owned && data.shared){
			// User and public Workspace
			Ti.API.info('TODO User & Public Workspace: ' + JSON.stringify(data));
		} else {
			// Public Workspace
			Ti.API.info('TODO Public Workspace: ' + JSON.stringify(data));
		}
		var result = {
            'title': {
                text: data.creator + '/' + data.name
            },
            'icon': {
            	text : (data.shared) ? Yaast.FontAwesome.getCharCode('fa-globe') :
                       Yaast.FontAwesome.getCharCode('fa-shield')
            },
            'id':{
            	text : data.id
            }
       };
       return result;
	};

	_self.setWorkspaces = function setWorkspaces(values) {
		if (values == "Error") {
			// getWirecloud error
			var _stringSearch;
			if (Ti.Network.online) _stringSearch = (_isApple) ? "error_connection_login_ios" : "error_connection_login_android";
			else _stringSearch = "error_connection_inet";
			var _alertError = Ti.UI.createAlertDialog({
				title: "Wirecloud",
				message: L(_stringSearch),
				buttonNames: [L("alert_button_accept")],
			});
			_alertError.show();
			_stringSearch = null;
			_alertError = null;
			Ti.API.info('Error getting Wirecoud Info');
		}
		else {
			// getWirecloud success
			var parsedValues = JSON.parse(values);
			// TODO file system persistence
			var newLink;
			var grainSection = Ti.UI.createListSection({headerView: createHeaderView()});
            var rows = [];
			for (var i = 0; i < parsedValues.length; i ++) {
				newLink = _self.createWorkspaceLink(parsedValues[i]);
				rows.push(newLink);
				_self.compositions[parsedValues[i].id] = parsedValues[i];
			}
			grainSection.setItems(rows);
			leftListView.setSections([grainSection]);
			grainSection = null;
            rows = null;
            leftListView.setTouchEnabled(true);
            leftView.add(leftListView);
            _self.view.add(leftView);
            _self.view.add(rightView);
		}
	};
	
	// Login Event and creation of MainView
	_self.getWirecloudInfo = function getWirecloudInfo(data){
		var _conObject = require('/connections/appConnection');
		var _conA = _conObject.getWorkspaces(_self.setWorkspaces);
		_conObject = null;
		_conA = null;
	};

    // Create Navigation Bar
    if(_isApple) {
        _self.view.add(Ti.UI.createView(theme.line));
    }
    topBar.add(buttonLogout);
    buttonLogout.setLeft(topBar.getWidth() - 140);
    buttonStore.setLeft(buttonLogout.getLeft() - 150);
    topBar.add(buttonStore);
    topBar.add(Ti.UI.createLabel(Yaast.MergeObject(theme.labelButton, {
        left: buttonLogout.getLeft() + parseInt(buttonLogout.getWidth()),
        text: ' logOut'
    })));
    topBar.add(Ti.UI.createLabel(Yaast.MergeObject(theme.labelButton, {
        left: buttonStore.getLeft() + parseInt(buttonStore.getWidth()),
        text: ' Store'
    })));
    topBar.add(wirecloudLogo);
    topBar.add(Ti.UI.createLabel(Yaast.MergeObject(theme.welcomeLabel, {
        left: wirecloudLogo.getLeft() + parseInt(wirecloudLogo.getWidth()) + 40,
        text: 'Welcome to Wirecloud 4 Tablet ' + userName
    })));
    _self.view.add(topBar);

    // Bind click Logout Button
    _self.clickLogoutButton = function clickLogoutButton() {
        parentWindow.showLoginView();
    };
    buttonLogout.addEventListener('singletap', _self.clickLogoutButton);

    // Bind click Store Button
    _self.clickStoreButton = function clickStoreButton() {
        parentWindow.showStoreView();
    };
    buttonStore.addEventListener('singletap', _self.clickStoreButton);

    // Create Connection to fill ListView
    _self.reloadTable = function reloadTable() {
    	Ti.API.info('----reloadTable in MainView');
        var compFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'composition').getDirectoryListing();
        var i;
        if(compFolder.length === 0){
        	Ti.API.info('----No offline Workspaces availables');
        	// TODO esto no va, hay que usar secciones, ya que se trata de un listView
            //leftListView.setTouchEnabled(false);
            //leftView.add(Ti.UI.createLabel(theme.leftListViewNoWorkspaces));
            _self.getWirecloudInfo();
        }
        else {
        	// TODO entrar con cosas guardadas en los meta (antes hay que crear los metadatos.. los defino en la detailView)
            var compositions = Ti.UI.createListSection();
            var rows = [];
            for(i = 0; i < compFolder.length; i++){
                var metadataComp = JSON.parse(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,
                    'composition/' + compFolder[i] + '/', '.metadata').read().toString());
                _self.compositions[compFolder[i]] = metadataComp;
                rows.push({
                    id: {
                        text: compFolder[i]
                    },
                    title: {
                        text: metadataComp.name
                    },
                    icon: {
                        text : (metadataComp.icon === "") ? Yaast.FontAwesome.getCharCode('fa-columns') :
                               Yaast.FontAwesome.getCharCode(metadataComp.icon)
                    }
                });
                metadataComp = null;
            }
            compositions.setItems(rows);
            leftView.setSections([compositions]);
            compositions = null;
            rows = null;
            _self.view.add(leftView);
        }
        compFolder = null;
    };

    // Create Details View of Composition
    _self.showDetailView = function showDetailView(idComposition) {
    	if (_self.detailView !== null) {
    		_self.view.remove(_self.detailView);
    		_self.detailView.destroy();
    	}
        _self.detailView = require('ui/view/mainViewDetail')(
            _self.compositions[idComposition],
            _self
        );
        _self.view.add(_self.detailView);
    };

    // Load Workspaces on ListView
    Ti.API.info('----Load Workspaces on ListView MainView');
    _self.reloadTable();

    // Destroy MainView
    _self.destroy = function destroy() {
    	if (_self.detailView !== null) {
    		_self.view.remove(_self.detailView);
    		_self.detailView.destroy();
    	}
        _self.view.remove(shadowView);
        shadowView = null;
        _self.view.remove(leftView);
        leftView = null;
        _self.view.remove(rightView);
        rightView = null;
        buttonLogout.removeEventListener('singletap', _self.clickLogoutButton);
        buttonStore.removeEventListener('singletap', _self.clickStoreButton);
        theme = null;
    };

    return _self;

};

module.exports = mainView;
