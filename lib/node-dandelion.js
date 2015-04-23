'use strict';

var request = require('request'),
	os = require('os');

var VERSION = '0.1.0';
var dandelionBaseURI = 'https://api.dandelion.eu/datatxt/';
var txtSimBaseURI = "sim/v1/";
var dandelionAppId = "";
var dandelionAppKey = "";

var dandelion = exports;

exports.configure = function (options) {
	if (options.baseURI) { dandelionBaseURI = options.baseURI; }
	if (options.app_id && options.app_key && options.app_id !== "" && options.app_key !== "") {
		dandelionAppId = options.app_id;
		dandelionAppKey = options.app_key;
	}
};

dandelion.userAgent = function () {
	return 'node-dandelion/' + VERSION + ' (node/' + process.version + '; ' +
		os.type() + '/' + os.release() + ')';
};


dandelion.txtSim = function(obj, callback){
	if (typeof callback === 'undefined') {
		return false;
	}

	var uri = dandelionBaseURI + txtSimBaseURI;

	if((obj.string1 && obj.string1.length > 0) && (obj.string2 && obj.string2.length > 0)){
		uri += "?text1=" + encodeURIComponent(obj.string1).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		uri += "&text2="+ encodeURIComponent(obj.string2).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}
	else {
		if (typeof callback == 'function') {
			var err = new Error("You must specify two parameters (string) for the similarity comparison.");
			err.statusCode = 500;
			callback(err, null);
			return;
		}
	}
	if (dandelionAppId && dandelionAppKey && dandelionAppId !== "" && dandelionAppKey !== "") {
		uri += "&$app_id="+ dandelionAppId +"&$app_key=" + dandelionAppKey;
	}
	else
	{
		if (typeof callback == 'function') {
			var err = new Error("You need to provide your dandelion.eu APP key and APP id.");
			err.statusCode = 500;
			callback(err, null);
			return;
		}
	}
	request({
		'method' : 'GET',
		'uri' : uri,
		'headers' : {
			'User-Agent': dandelion.userAgent()
		}
	}, function (err, response, body) {
		if (err) { callback(err, null); return; }
		if (!err && response.statusCode == 200) {
			callback(JSON.parse(body), 200);
		} else {
			if (typeof callback == 'function') {
				var message = JSON.parse(body).message;
				var err = new Error(message);
				err.statusCode = response.statusCode;
				callback(err, null);
			}
		}
	});
};

dandelion.VERSION = VERSION;
