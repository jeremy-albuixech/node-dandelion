'use strict';

var request = require('request'),
	os = require('os');

var VERSION = '1.0.2';
var dandelionBaseURI = 'https://api.dandelion.eu/datatxt/';
var txtSimBaseURI = "sim/v1/";
var txtNexBaseURI = "nex/v1/";
var txtClBaseURI = "cl/v1/";
var txtClModelBaseURI = "cl/models/v1/";
var txtLiBaseURI = "li/v1/";
var txtCustomSpots = "custom-spots/v1/";
var dandelionAppId = "";
var dandelionAppKey = "";
var dandelionToken = "";
var auth = false;


var dandelion = exports;

exports.configure = function (options) {
	if (options.baseURI) { dandelionBaseURI = options.baseURI; }
	if (options.app_id && options.app_key && options.app_id !== "" && options.app_key !== "") {
		dandelionAppId = options.app_id;
		dandelionAppKey = options.app_key;
	}
	if (options.token && options.token !== ""){
		dandelionToken = options.token;
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
	auth = false;
	if (dandelionToken && dandelionToken !== ""){
		uri += "&token=" + dandelionToken;
		auth = true;
	}
	if (auth==false && dandelionAppId && dandelionAppKey && dandelionAppId !== "" && dandelionAppKey !== "") {
		uri += "&$app_id="+ dandelionAppId +"&$app_key=" + dandelionAppKey;
		auth = true;
	}
	if (auth==false)
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

dandelion.txtNexConstructUrl = function(obj, callback){

	/***********
		Options available for the TxtNex:
		text|url|html|html_fragment : required
		lang: optional | Accepted values	de | en | fr | it | pt | auto
		min_confidence: optional | Accepted values 0.0 .. 1.0
		min_length: optional | Accepted values	2 .. +inf
		social.hashtag: optional | Accepted values:	true | false
		social.mention: optional | Accepted values: true | false
		include: optional | Accepted values: types, categories, abstract, image, lod, alternate_labels
		extra_types: optional | Accepted values:	phone, vat
		country: optional | Accepted values:	AD, AE, AM, AO, AQ, AR, AU, BB, BR, BS, BY, CA, CH, CL, CN, CX, DE, FR, GB, HU, IT, JP, KR, MX, NZ, PG, PL, RE, SE, SG, US, YT, ZW
		custom_spots: optional | Accepted values: any valid custom spot ID.
		epsilon: optional | Accepted values:	0.0 .. 0.5
		REF: https://dandelion.eu/docs/api/datatxt/nex/v1/
	***********/

	// Initialization of the API txtNex URL
	var uri = dandelionBaseURI + txtNexBaseURI;

	// We will need at least one value for the analysis
	if(!obj.string.value && obj.string.value.length <= 0){
		if (typeof callback == 'function') {
			var err = {
				"success":false,
				"message":"You must specify one parameter (string) for the NEX Analysis."
			}
			callback(err, null);
			return;
		}
	}
	// We build the required parameter in the URL
	if(obj.string.value && obj.string.value.length > 0){
		var stringObj = obj.string;
		var stringVal =  encodeURIComponent(stringObj.value).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		switch(stringObj.type) {
			case "text":
				uri += "?text=" +stringVal;
				break;
			case "url":
				uri += "?url=" +stringVal;
				break;
			case "html":
				uri += "?html=" +stringVal;
				break
			case "html_fragment":
				uri += "?html_fragment=" +stringVal;
				break;
			default:
				uri += "?text=" +stringVal;
				break;
		}
	}

	// We include the provided optional parameters
	var optionalParams = obj.extras;
	if(optionalParams && optionalParams.length > 0){
		for(var i=0; i<=optionalParams.length; i++){
			var option = optionalParams[i];
			for (var key in option) {
				uri += "&" + key + "=" + encodeURIComponent(option[key]).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");;
			}
		}
	}
	// We inject the APP key and ID in the url
	auth = false;
	if (dandelionToken && dandelionToken !== ""){
		uri += "&token=" + dandelionToken;
		auth = true;
	}
	if (auth==false && dandelionAppId && dandelionAppKey && dandelionAppId !== "" && dandelionAppKey !== "") {
		uri += "&$app_id="+ dandelionAppId +"&$app_key=" + dandelionAppKey;
		auth = true;
	}
	if (auth==false)
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


dandelion.txtClConstructUrl = function(obj, callback){

	/***********
		Options available for the TxtCl:
		text|url|html|html_fragment : required
		model: required | Unique ID of the model you want to use
		min_score: optional | Accepted values 0.0 .. 1.0
		max_annotations: optional | Accepted values	1 .. +inf
		include: optional | Accepted value:	score_details
		nex_extras: any set of txtNex parameters
		REF: https://dandelion.eu/docs/api/datatxt/cl/v1/
	***********/

	// Initialization of the API txtCl URL
	var uri = dandelionBaseURI + txtClBaseURI;

	// We will need at least one value for the analysis
	if(!obj.string.value && obj.string.value.length <= 0){
		if (typeof callback == 'function') {
			var err = {
				"success":false,
				"message":"You must specify one parameter (string) for the NEX Analysis."
			}
			callback(err, null);
			return;
		}
	}
	// We build the required parameter in the URL
	if(obj.string.value && obj.string.value.length > 0){
		var stringObj = obj.string;
		var stringVal =  encodeURIComponent(stringObj.value).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		switch(stringObj.type) {
			case "text":
				uri += "?text=" +stringVal;
				break;
			case "url":
				uri += "?url=" +stringVal;
				break;
			case "html":
				uri += "?html=" +stringVal;
				break
			case "html_fragment":
				uri += "?html_fragment=" +stringVal;
				break;
			default:
				uri += "?text=" +stringVal;
				break;
		}
	}

	// We include the required Model parameter
	if(obj.model && obj.model.length > 0){
		uri += "&model=" + encodeURIComponent(obj.model).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");;
	}

	// We include the provided optional parameters
	var optionalParams = obj.extras;
	if(optionalParams && optionalParams.length > 0){
		for(var i=0; i<=optionalParams.length; i++){
			var option = optionalParams[i];
			for (var key in option) {
				uri += "&" + key + "=" + encodeURIComponent(option[key]).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");;
			}
		}
	}
	// We include the provided extra NEX parameters
	var NexParams = obj.nex_extras;
	if(NexParams && NexParams.length > 0){
		for(var i=0; i<=NexParams.length; i++){
			var option = NexParams[i];
			for (var key in option) {
				uri += "&nex." + key + "=" + encodeURIComponent(option[key]).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");;
			}
		}
	}
	// We inject the APP key and ID in the url
	auth = false;
	if (dandelionToken && dandelionToken !== ""){
		uri += "&token=" + dandelionToken;
		auth = true;
	}
	if (auth==false && dandelionAppId && dandelionAppKey && dandelionAppId !== "" && dandelionAppKey !== "") {
		uri += "&$app_id="+ dandelionAppId +"&$app_key=" + dandelionAppKey;
		auth = true;
	}
	if (auth==false)
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

dandelion.txtLiConstructUrl = function(obj, callback){

	/***********
		Options available for the TxtLi:
		text|url|html|html_fragment : required
		clean: optional | Accepted values:	true | false
		REF: https://dandelion.eu/docs/api/datatxt/li/v1/
	***********/

	// Initialization of the API txtLi URL
	var uri = dandelionBaseURI + txtLiBaseURI;

	// We will need at least one value for the analysis
	if(!obj.string.value && obj.string.value.length <= 0){
		if (typeof callback == 'function') {
			var err = {
				"success":false,
				"message":"You must specify one parameter (string) for the NEX Analysis."
			}
			callback(err, null);
			return;
		}
	}
	// We build the required parameter in the URL
	if(obj.string.value && obj.string.value.length > 0){
		var stringObj = obj.string;
		var stringVal =  encodeURIComponent(stringObj.value).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		switch(stringObj.type) {
			case "text":
				uri += "?text=" +stringVal;
				break;
			case "url":
				uri += "?url=" +stringVal;
				break;
			case "html":
				uri += "?html=" +stringVal;
				break
			case "html_fragment":
				uri += "?html_fragment=" +stringVal;
				break;
			default:
				uri += "?text=" +stringVal;
				break;
		}
	}
	// We include the optional clean parameter if provided
	if(obj.clean != undefined){
			uri += "&clean=" + obj.clean;
	}
	// We inject token or  APP key and ID in the url
	auth = false;
	if (dandelionToken && dandelionToken !== ""){
		uri += "&token=" + dandelionToken;
		auth = true;
	}
	if (auth==false && dandelionAppId && dandelionAppKey && dandelionAppId !== "" && dandelionAppKey !== "") {
		uri += "&$app_id="+ dandelionAppId +"&$app_key=" + dandelionAppKey;
		auth = true;
	}
	if (auth==false)
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

/**** dataTXT-NEX ****
dataTXT-NEX is a named entity extraction & linking API.
With this API you will be able to automatically tag your texts, extracting Wikipedia entities and enriching your data.
******************/
dandelion.txtNex = function(obj, callback){
	if (typeof callback === 'undefined') {
		return;
	}
	dandelion.txtNexConstructUrl(obj, function(err, uri){
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
/**** dataTXT-Sim ****
dataTXT-SIM is a semantic sentence similarity API optimized on short sentences.
With this API you will be able to compare two sentences and get a score of their semantic similarity.
******************/
dandelion.txtSim = function(obj, callback){
	if (typeof callback === 'undefined') {
		return;
	}
	dandelion.txtSimConstructUrl(obj, function(err, uri){
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
/**** dataTXT-CL ****
dataTXT-CL classifies short documents into a set of user-defined classes.
******************/
dandelion.txtCl = function(obj, callback){
	if (typeof callback === 'undefined') {
		return;
	}
	dandelion.txtClConstructUrl(obj, function(err, uri){
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
/**** dataTXT-Li ****
dataTXT-LI is a simple language identification API;
******************/
dandelion.txtLi = function(obj, callback){
	if (typeof callback === 'undefined') {
		return;
	}
	dandelion.txtLiConstructUrl(obj, function(err, uri){
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
