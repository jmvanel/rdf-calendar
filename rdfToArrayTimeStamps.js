// uncomment for use with Node.js
//const rdf = require('rdf-ext')
//const rdfFetch = require('rdf-fetch')

/** take all the temporal stuff in the triples;
it will gather typed literals with xsd:date, xsd:dateTime,
and labels, keeping @id for possible link creation.
@param RDF URL (can be a SPARQL GET query)
@return array of objects with "date" and "subject" keys (for onuridrisoglu/calendar-component)
*/
function rdfCalendar_rdfToArrayTimeStamps(rdfUrl) {
}
