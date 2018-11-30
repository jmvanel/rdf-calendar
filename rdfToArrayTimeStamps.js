// For use with Node.js , comment for browser
const rdf = require('rdf-ext')
const rdfFetch = require('rdf-fetch')
const JsonLdSerializer = require('rdf-serializer-jsonld-ext')

/** take all the temporal stuff in the triples;
it will gather typed literals with xsd:date, xsd:dateTime,
and labels, keeping @id for possible link creation.

Took inspiration from
https://github.com/rdf-ext/rdf-examples/blob/develop/serialize-jsonld-with-prefix-map.js
https://github.com/rdf-ext/rdf-examples/blob/develop/fetch-dbpedia.js
https://github.com/rdf-ext/rdf-serializer-jsonld-ext/blob/master/test/test.js#L71

@param RDF URL (can be a SPARQL GET query)
@return array of objects with "date" and "subject" keys (for onuridrisoglu/calendar-component)
*/
function rdfCalendar_rdfToArrayTimeStamps(rdfUrl) {

  // create apropriate @context,
  const context = {
    '@context': {
       "date": {
         "@id" : "http://dbpedia.org/ontology/startDate",
         "@type" : "http://www.w3.org/2001/XMLSchema#date" },
       "subject": "http://www.w3.org/2000/01/rdf-schema#label"
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
    stream.on('data', (data) => {
      result = data
    })

    /* rdf.waitFor() wraps a stream into a Promise: https://github.com/rdf-ext/rdf-ext/blob/master/lib/streams.js#L17
In the jsonld serializer case the stream should emit one data event and after that an end event.
The end event is used to resolve the promise. */

    return rdf.waitFor(stream).then(() => result )

  }).catch((err) => {
    console.error(err.stack || err.message)
  })
}

function test_rdfCalendar_rdfToArrayTimeStamps() {
  var jsonDataFromRdf =
    rdfCalendar_rdfToArrayTimeStamps(
"http://semantic-forms.cc:1952/download?url=http%3A%2F%2Fsemantic-forms.cc%3A1952%2Fldp%2F1543562762912-1786636722827768&syntax=JSON-LD"
)
    // serialize output to stdout
     console.log( 'JSON output: ' + JSON.stringify(jsonDataFromRdf) )
    // TODO why empty result ??? probably it's a Future ...
}

test_rdfCalendar_rdfToArrayTimeStamps()

