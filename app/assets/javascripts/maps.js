var map;

function initialize(lat,lon) {
  if (initialize.ran==true)
    return;

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
      animation: google.maps.Animation.DROP
    });
  });
}