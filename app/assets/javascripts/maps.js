var map;

function initialize(lat,lon) {
  if (initialize.ran==true)
    return;

  initialize.lat=lat;
  initialize.lon=lon;

  var mapOptions = {
    center: new google.maps.LatLng(lat, lon),
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

//  google.maps.event.addDomListener(window, 'load', initialize);
function add_markers(markers) {
  if (initialize.ran==true)
    return;

  _.each(markers, function(item, index) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(item[1], item[0]),
      map: map,
      draggable: false,
      icon: '/assets/logo-micro.png',
      animation: google.maps.Animation.DROP
    });
    google.maps.event.addListener(marker, 'click', function() { 
      window.location = '/stop/' + stop_ids[index];
    });
  });

  var yah_marker = new google.maps.Marker({
    position: new google.maps.LatLng(initialize.lat,initialize.lon),
    map: map,
    draggable: false,
    icon: '/assets/you-are-here.png',
    animation: google.maps.Animation.DROP
  });
}
