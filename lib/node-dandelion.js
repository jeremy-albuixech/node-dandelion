'use strict';

var request = require('request'),
	os = require('os');

var VERSION = '0.1.2';
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


dandelion.txtSimConstructUrl = function(obj, callback){

	/***********
		Options available for the TxtSim:
		text1|url1|html1|html_fragment1 : required
		text2|url2|html2|html_fragment2 : required
		lang: optional | Accepted values	de | en | fr | it | pt | auto
		bow: optional | Accepted values	always | one_empty | both_empty | never
		text1|url1|html1|html_fragment1 required
		REF: https://dandelion.eu/docs/api/datatxt/sim/v1/
	***********/

	// Initialization of the API txtSim URL
	var uri = dandelionBaseURI + txtSimBaseURI;

	// We will need at least two values for the comparison
	if(!obj.string1.value && obj.string1.value.length <= 0 || !obj.string2.value && obj.string2.value.length <= 0){
		if (typeof callback == 'function') {
			var err = {
				"success":false,
				"message":"You must specify two parameters (string1 & string2) for the similarity comparison."
			}
			callback(err, null);
			return;
		}
	}
	// We build the two required parameters in the URL
	if(obj.string1.value && obj.string1.value.length > 0){
		var stringObj = obj.string1;
		var stringVal =  encodeURIComponent(stringObj.value).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		switch(stringObj.type) {
			case "text":
				uri += "?text1=" +stringVal;
				break;
			case "url":
				uri += "?url1=" +stringVal;
				break;
			case "html":
				uri += "?html1=" +stringVal;
				break
			case "html_fragment":
				uri += "?html_fragment1=" +stringVal;
				break;
			default:
				uri += "?text1=" +stringVal;
				break;
		}
	}
	if(obj.string2.value && obj.string2.value.length > 0){
		var stringObj = obj.string2;
		var stringVal =  encodeURIComponent(stringObj.value).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		switch(stringObj.type) {
			case "text":
				uri += "&text2=" +stringVal;
				break;
			case "url":
				uri += "&url2=" +stringVal;
				break;
			case "html":
				uri += "&html2=" +stringVal;
				break
			case "html_fragment":
				uri += "&html_fragment2=" +stringVal;
				break;
			default:
				uri += "&text2=" +stringVal;
				break;
		}
	}

	// We include the optional lang parameter if provided
	if(obj.lang && obj.lang.length > 0){
			uri += "&lang=" + obj.lang;
	}

	// We include the optional bow parameter if provided
	if(obj.bow && obj.bow.length > 0){
			uri += "&bow=" + obj.bow;
	}
	// We inject the APP key and ID in the url
	if (dandelionAppId && dandelionAppKey && dandelionAppId !== "" && dandelionAppKey !== "") {
		uri += "&$app_id="+ dandelionAppId +"&$app_key=" + dandelionAppKey;
	}
	else
	{
		if (typeof callback == 'function') {
			var err = {
				"success":false,
				"message":"You need to provide your dandelion.eu APP key and APP id."
			}
			callback(err, null);
			return;
		}
	}
	callback(null,uri);
}
dandelion.txtSim = function(obj, callback){
	if (typeof callback === 'undefined') {
		return;
	}
	dandelion.txtSimConstructUrl(obj, function(err, uri){
		console.log(uri);
			if(err && !err.success) {
				var err = new Error(err.message);
				err.statusCode = 500;
				callback(err, null);
				return;
			}
			else
			{
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
						var message = JSON.parse(body).message;
						var err = new Error(message);
						err.statusCode = response.statusCode;
						callback(err, null);
					}
				});
			}
	});

};

dandelion.VERSION = VERSION;
