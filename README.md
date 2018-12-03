# rdf-calendar
Javascript HTML library for calendar from RDF data
Basically works, but needs more testing.

The targeted Web component is
https://www.webcomponents.org/element/onuridrisoglu/calendar-component

The principle, like the geography component of Semantic_Forms, is to take all the temporal stuff in the triples and display that at best.
Therefore it will not be based on RDF properties like the RDF geography component https://github.com/jmvanel/rdf-geo-map, but on typed literals xsd:date, xsd:dateTime .

I will not do the Web Component packaging, because I can not do it, and that functionally it is not essential.

# Test with node

```shell
node install
node --use-strict rdfToArrayTimeStamps.js
```

# Test in browser

Test locally with
file:///home/jmv/src/rdf-calendar/rdf-calendar.html?url=http://semantic-forms.cc:1952/ldp/1543562762912-1786636722827768 

or with SPARQL query
```SPARQL
CONSTRUCT {
  ?S <http://dbpedia.org/ontology/startDate> ?DATE .
  ?S <http://purl.org/NET/c4dm/event.owl#agent> ?AGENT .
  ?S <http://purl.org/NET/c4dm/event.owl#place> ?PLACE .
  ?S <http://purl.org/dc/terms/subject> ?SUBJECT .
  ?S <http://www.w3.org/2000/01/rdf-schema#label> ?LAB . 
} WHERE {
  GRAPH ?G {
  OPTIONAL { ?S <http://purl.org/NET/c4dm/event.owl#agent> ?AGENT . }
  OPTIONAL { ?S <http://purl.org/NET/c4dm/event.owl#place> ?PLACE . }
  OPTIONAL { ?S <http://purl.org/dc/terms/subject> ?SUBJECT . }
  ?S a <http://schema.org/Event> .
  ?S <http://dbpedia.org/ontology/startDate> ?DATE .
  OPTIONAL { ?S <http://www.w3.org/2000/01/rdf-schema#label> ?LAB . }
 FILTER ( STR(?DATE) >= STR(NOW()) ) 
} }
```
on SPARQL server http://semantic-forms.cc:1952/sparql .
