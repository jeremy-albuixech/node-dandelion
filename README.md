# node-dandelion
A nodejs client for the Dandelion.eu API.

Bring the powerful text analysis tools from Dandelion.eu to your NodeJs apps.

This client is a work in progress. As of v0.1.1 the TXT-Sim API is fully featured.

The TXT-Sim is used to calculate the semantic or syntactic similarities between two texts.

# Installation
###  npm install node-dandelion

# Parameters:

```javscript
dandelion.txtSim(object, callback);
With object = {
  "string1":{
    "type":"txt"|"html"|"url"|"html_fragment",
    "value":"Your first value here"
  },
  "string2":{
    "type":"txt"|"html"|"url"|"html_fragment",
    "value": "Your second value here"
  },
  "lang":"de"|"en"|"fr"|"it"|"pt"|"auto",
  "bow":"always"|"one_empty"|"both_empty"|"never"
}
"string1", "string2" are required.
"lang", "bow" are optional.
```
# Example:
```javascript
var dandelion = require("node-dandelion");
dandelion.configure({
  "app_key":"YOUR_APP_KEY",
  "app_id":"YOUR_APP_ID"
});
dandelion.txtSim(
  {
    "string1": {
      "type":"txt",
      "value":"Reports that the NSA eavesdropped on world leaders have \"severely shaken\" relations between Europe and the U.S., German Chancellor Angela Merkel said."
    },
    "string2":{
      "type":"txt",
      "value":"Germany and France are to seek talks with the US to settle a row over spying, as espionage claims continue to overshadow an EU summit in Brussels."
    },
    "lang":"en",
    "bow":"never"
  },
  function(results){
    /***** RESULTS: *****
    { time: 2,
    similarity: 0.4987,
    lang: 'en',
    timestamp: '2015-04-24T15:46:09.625' }
    **********/
  }
);
```
# Contribute:
- Fork the Master branch
- Create a pull request
