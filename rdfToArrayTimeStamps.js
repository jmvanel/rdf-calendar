// For use with Node.js , comment for browser
// const rdf = require('rdf-ext')
// const rdfFetch = require('rdf-fetch')
// const JsonLdSerializer = require('rdf-serializer-jsonld-ext')

/** take all the temporal stuff in the triples, and outputs it in JSON suitable for calendar UI;
Currently gathers rdfs:label and dbpedia:startDate .
Later it will gather all typed literals with xsd:date, xsd:dateTime,
and labels, keeping @id for possible link creation.

Use a local JSON-LD @context to translate the input JSON-LD:
- read RDF URL,
- serialize in JSON-LD with a specific @context,
- map to calendar UI format

Took inspiration from
https://github.com/rdf-ext/rdf-examples/blob/develop/serialize-jsonld-with-prefix-map.js
https://github.com/rdf-ext/rdf-examples/blob/develop/fetch-dbpedia.js
https://github.com/rdf-ext/rdf-serializer-jsonld-ext/blob/master/test/test.js#L71

@param RDF URL (can be a SPARQL GET query)
@return Promise to array of objects with "date" and "subject" keys (for onuridrisoglu/calendar-component)
*/
function rdfCalendar_rdfToArrayTimeStamps(rdfUrl) {

  // create apropriate @context,
  const context = {
    '@context': {
       "date": {
         "@id" : "http://dbpedia.org/ontology/startDate"
         // , "@type" : "http://www.w3.org/2001/XMLSchema#date"
       } ,
       "subject": {
         "@id" : "http://www.w3.org/2000/01/rdf-schema#label",
         // "@type" : "http://www.w3.org/2001/XMLSchema#string"
       }
    },
  }

  return rdfFetch( rdfUrl ).then( (res) => {
    return res.quadStream()
  }).then((quadStream) => {
    const serializer = new JsonLdSerializer({context: context, flatten: true})
    const stream = serializer.import(quadStream)

    /* you need the stream.on(data) to receive the jsonld object
     * streams are by default paused.
     * The 'data' event handler starts it */
    let result
    stream.on('data', (data) => { result = data })

    /* rdf.waitFor() wraps a stream into a Promise: https://github.com/rdf-ext/rdf-ext/blob/master/lib/streams.js#L17
In the jsonld serializer case the stream should emit one data event and after that an end event.
The end event is used to resolve the promise. */

    return rdf.waitFor(stream).then(() => result )
  })
}

/** The JSON-LD value for date can be with or without @type */
function getStringFromJSONLDvalue( jsonLDvalue ) {
  if( jsonLDvalue == undefined ) return null
  let possibleValue = jsonLDvalue["@value"]
  if (possibleValue) return possibleValue
  else return jsonLDvalue
}

/** transform JSON-LD for Calendar */
function transformJSONLDforCalendar( result ) {
      let events = result["@graph"]
 // console.log( 'JSON.stringify(events)') ; console.log( JSON.stringify(events))
      let eventsForCalendar = events . map ( event => {
// console.log( 'JSON.stringify(event)'); console.log( JSON.stringify(event));
        return {
          "date":	getStringFromJSONLDvalue(event.date) ,
          "subject":	getStringFromJSONLDvalue(event.subject) ,
          "uri":  event["@id"]
        }
      })
  return eventsForCalendar
}

function test_rdfCalendar_rdfToArrayTimeStamps(url) {
  let jsonDataFromRdf = rdfCalendar_rdfToArrayTimeStamps( url )
    jsonDataFromRdf.then(result => {
      // console.log( JSON.stringify(result, null, 2) )
      let eventsForCalendar = transformJSONLDforCalendar( result )
      console.log( JSON.stringify(eventsForCalendar) )
  })
  .catch((err) => { console.error(err.stack || err.message) })
}

/*
test_rdfCalendar_rdfToArrayTimeStamps(
"http://semantic-forms.cc:1952/download?url=http%3A%2F%2Fsemantic-forms.cc%3A1952%2Fldp%2F1543562762912-1786636722827768&syntax=JSON-LD")
*/

