

function rdfCalendar(rdfUrl) {
  var calendar = document.querySelector('calendar-component');
  document.addEventListener('EventClicked', function(e) {
    alert('Event clicked : ['+e.detail.subject+']');
  });
  calendar.items = rdfCalendar_rdfToArrayTimeStamps(rdfUrl)
}
