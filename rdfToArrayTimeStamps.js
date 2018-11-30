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

@param RDF URL (can be a SPARQL GET query)
@return array of objects with "date" and "subject" keys (for onuridrisoglu/calendar-component)
*/
function rdfCalendar_rdfToArrayTimeStamps(rdfUrl) {

  return rdfFetch( rdfUrl ).then(
      (res) => {
      // console.log( 'FETCH ' + res );
  return res.quadStream()
  }).then((quadStream) => {
    // create a JSON-LD serializer instance which returns strings and compacts the JSON-LD
    const serializer = new JsonLdSerializer({outputFormat: 'string', compact: true})

    // forward the quads to the serializer
    const jsonStream = serializer.import(quadStream)

    // pipe the serializer output to stdout
    jsonStream.pipe(process.stdout)
    // TODO use the JSON structure
  })
}

function test_rdfCalendar_rdfToArrayTimeStamps() {
  rdfCalendar_rdfToArrayTimeStamps("http://localhost:9000/download?url=http%3A%2F%2Flocalhost%3A9000%2Fldp%2F1542199835221-340123593949653&syntax=JSON-LD")
}

test_rdfCalendar_rdfToArrayTimeStamps()

