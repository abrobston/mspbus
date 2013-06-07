function BusETA(stopid, success) {
  stopid=stopid.toString();
  $.getJSON( 'http://svc.metrotransit.org/NexTrip/'+stopid+'?callback=?&format=json', '', 
    function(data, textStatus, jqXHR){
      success(data);
    }
  );
}


function get_direction_class(route) {
  if(route === 'SOUTHBOUND') {
    return 'icon-arrow-down';
  } else if(route === 'NORTHBOUND') {
    return 'icon-arrow-up';
  } else if(route === 'EASTBOUND') {
    return 'icon-arrow-right';
  } else if(route === 'WESTBOUND') {
    return 'icon-arrow-left';
  }
}

function get_priority(eta) {
  if(eta<5)
    return "#B94A48";
  else if (eta<15)
    return "#F89406";
  else if (eta<20)
    return "#468847";
  else
    return "#000080";
}

function process_eta(obj) {
  var seconds=obj.DepartureTime.substr(6,10);
  var offset=obj.DepartureTime.substr(19,3);

  obj.arrtime=moment(seconds, "X");
  var ctime=moment();

  obj.dtime=(obj.arrtime-ctime)/1000/60; //Convert to minutes

  obj.priority=get_priority(obj.dtime);

  if(obj.DepartureText=="Due")
    obj.DepartureText="Now";

  obj.direction = get_direction_class(obj.RouteDirection);

  return obj;
}
