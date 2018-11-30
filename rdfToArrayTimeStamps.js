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
       "subject": {
         "@id" : "http://www.w3.org/2000/01/rdf-schema#label" }
    },
  }

  return rdfFetch( rdfUrl ).then(
      (res) => {
      console.log( 'FETCH ' + res );
  return res.quadStream()
  }).then((quadStream) => {
    console.log( 'FETCH quadStream ' + quadStream );
    // create a JSON-LD serializer instance which returns strings and compacts the JSON-LD
    const serializer = new JsonLdSerializer({context: context})

    // forward the quads to the serializer
    const stream = serializer.import(quadStream)
    // console.log( 'FETCH stream  ' + JSON.stringify(stream, null, 2) );

    let result
    stream.on('data', (data) => {
      result = data
    })

    console.log( 'FETCH result ' + result, null, 2)
    // TODO actually start the JsonLdSerializer ???

    // use the JSON structure to feed the JSON structure to the calendar
    return result;
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

