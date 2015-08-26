# node-dandelion
A nodejs client for the Dandelion API.

Bring the powerful text analysis tools from Dandelion API to your NodeJs apps.

This client is a work in progress.

As of v1.0.0, the following endpoints of Dandelion API are featured:
- Text Similarity API: dandelion.txtSim(obj, callback)
- Entity Extraction API: dandelion.txtNex(obj, callback)
- Text Classification API: dandelion.txtCl(obj, callback)
- Language Detection API: dandelion.txtLi(obj, callback)

The POST endpoints are not implemented yet.


# Installation
###  npm install node-dandelion

# Parameters:
## TXT-SIM = Check for similarities between two texts.
```javascript
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
## TXT-NEX = Check for topics and other keywords extractions in one text
```javascript
dandelion.txtNex(object, callback);
With object = {
  "string":{
    "type":"txt"|"html"|"url"|"html_fragment",
    "value":"Your value here"
  },
  "extras": [
    {
      "lang":"de"|"en"|"fr"|"it"|"pt"|"auto"
    },
    {
      "min_confidence": 0.0 to 1.0
    },
    ...
  ]
}
"string" is required.
In the "extras" object, you can use any optional parameters from the API.
Check the full reference here: https://dandelion.eu/docs/api/datatxt/nex/v1/
```
## TXT-CL = Classify a text into topics
```javascript
dandelion.txtCl(object, callback);
With object = {
  "string":{
    "type":"txt"|"html"|"url"|"html_fragment",
    "value":"Your value here"
  },
  "model": "MODEL ID",
  "extras": [
    {
      "max_annotations": 1 to +inf
    },
    {
      "min_score": 0.0 to 1.0
    },
    ...
  ],
  "nex_extras": [
    {
      "lang":"de"|"en"|"fr"|"it"|"pt"|"auto"
    },
    ...
  ]
}
"string", "model" are required.
In the "extras" object, you can use any optional parameters from the API.
In the "nex_extras" object, you can use any optional parameters from the NEX API.
Check the full reference here: https://dandelion.eu/docs/api/datatxt/cl/v1/
```

## TXT-LI = Find the language of a text
```javascript
dandelion.txtLi(object, callback);
With object = {
  "string":{
    "type":"txt"|"html"|"url"|"html_fragment",
    "value":"Your value here"
  },
  "clean": true | false
}
"string" is required.
Check the full reference here: https://dandelion.eu/docs/api/datatxt/li/v1/
```


# Example:
```javascript
var dandelion = require("node-dandelion");
dandelion.configure({
  "app_key":"YOUR_APP_KEY",
  "app_id":"YOUR_APP_ID"
});

// TXT SIM: Check for the similitudes between the two strings.
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

// TXT NEX: Check for specific topics, person, or other types of concepts in the provided text.
dandelion.txtNex(
  {
    "string": {
      "type":"txt",
      "value": "\"Loneliness is young Ambitions ladder\" w.Shakespeare"
    },
    "extras": [
      {
        "min_confidence": 0.7
      },
      {
        "social.hashtag": true
      },
      {
        "social.mention": true
      },
      {
        "include": "types, categories, abstract, image, lod, alternate_labels"
      },
      {
        "epsilon": 0.5
      }
    ]
  },
  function(results){
    /***** RESULTS: *****
    { time: 1,
    annotations:
   [ { start: 39,
       end: 53,
       spot: 'w\\.Shakespeare',
       confidence: 0.7779,
       id: 32897,
       title: 'William Shakespeare',
       uri: 'http://en.wikipedia.org/wiki/William_Shakespeare',
       abstract: 'William Shakespeare (; 26 April 1564 (baptised) – 23 April 1616) was an English ,  and actor, widely regarded as the greatest writer in the English language and the world\'s pre-eminent dramatist. He is often called England\'s national poet and the "Bard of Avon". His extant works, including some collaborations, consist of about 38 plays, 154 sonnets, two long narrative poems, and a few other verses, the authorship of some of which is uncertain. His plays have been translated into every major living language and are performed more often than those of any other playwright.',
       label: 'William Shakespeare',
       categories: [Object],
       types: [Object],
       alternateLabels: [Object],
       image: [Object],
       lod: [Object] } ],
  lang: 'en',
  langConfidence: 1,
  timestamp: '2015-04-24T22:50:33.478' }
  **********/
  }
);
```
# Contribute:
- Fork the Master branch
- Create a pull request
