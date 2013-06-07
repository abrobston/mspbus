var RealtimeModel = Backbone.Model.extend({
  urlRoot : 'http://svc.metrotransit.org/NexTrip/',
  // override backbone synch to force a jsonp call
  sync: function(method, model, options) {
    // Default JSON-request options.
    var params = _.extend({
      type:         'GET',
      dataType:     'jsonp',
      url:      model.url()+"?callback=?&format=json",
      processData:  false
    }, options);
 
    // Make the request.
    return $.ajax(params);
  },
  
  parse: function(response) {
    // parse can be invoked for fetch and save, in case of save it can be undefined so check before using 
    if (response) {
      if (response.success ) {
                                // here you write code to parse the model data returned and return it as a js object 
                                // of attributeName: attributeValue
                                
        return {name: response.name};      // just an example,                
      } 
    }
  }
});

// Realtime Template
var realtime_template = _.template('<% _.each(data, function(item) { %> <span class="label <%= item.priority %>"><i class="<%= item.direction %>"></i> <b><%= item.Route %><%= item.Terminal %></b> <i><%= item.DepartureText %></i></span> <% }); %>');

$(document).ready(function() {

  // Loop over stops and get realtime data
  $(".real-time").each(function(index, item) {
    var realtime_model = new RealtimeModel({ id: item.id, dataType: 'jsonp' });
    realtime_model.fetch({ success: got_data });

  });
  
  // Callback on realtime model.
  function got_data(model, data) {
    if(data.length==0){
      $("#" + model.id).parent().parent().hide();
      return;
    }


//    data=_.filter(data,function(obj) { return obj.Actual }); //Only show real-time data
    data=_.map(data,
      function(obj) {
        var seconds=obj.DepartureTime.substr(6,10);
        var offset=obj.DepartureTime.substr(19,3);

        obj.arrtime=moment(seconds, "X");
        var ctime=moment();

        var dtime=(obj.arrtime-ctime)/1000/60; //Convert to minutes

        if(dtime<5)
          obj.priority="label-important";
        else if (dtime<12)
          obj.priority="label-warning";
        else if (dtime<20)
          obj.priority="label-success";
        else
          obj.priority="label-info";

        if(obj.DepartureText=="Due")
          obj.DepartureText="Now";

        obj.direction = get_direction_class(obj.RouteDirection);

        if(dtime<20 && obj.DepartureText.indexOf(":")!=-1)
          obj.DepartureText='&ndash; ' + Math.round(dtime)+' Min <i title="Bus scheduled, no real-time data available." class="icon-question-sign"></i>';
        else if(dtime>=20)
          obj.DepartureText='';
        else
          obj.DepartureText='&ndash; ' + obj.DepartureText;

        return obj;
      }
    );

    data=_.sortBy(data,function(obj) { return obj.arrtime; });
    data=data.slice(0,5);

    $("#" + model.id).html( realtime_template({ data: data }) );
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

  function got_coordiates(position) {
    $.cookie('lat', position.coords.latitude, { expires: 1 });
    $.cookie('lon', position.coords.longitude, { expires: 1 });

    window.location = '/';

    $.removeCookie('q');
    //window.location = '/?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude;
  }

  function error_on_coordinates() {
  	$('#ask').modal("hide");
  	$('#error').modal();
  }

  // Setup location handlers
  $('.navbar-form').on('submit', function (event) {
    event.preventDefault();
    var form = $(this)
    var geocoder = new google.maps.Geocoder();
    // from http://www.mngeo.state.mn.us/chouse/coordinates.html
    var bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(44.47,-94.01),
      new google.maps.LatLng(45.42,-92.73)
    );
    geocoder.geocode({'address': form.find('#q').val(), 'bounds': bounds}, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK && results[0]) {
        $.cookie('lat', results[0].geometry.location.lat(), { expires: 1 });
        $.cookie('lon', results[0].geometry.location.lng(), { expires: 1 });
      }
      event.target.submit();
    });
    return false;
  });

  $('.btn-current-location').on('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(got_coordiates, error_on_coordinates);
    }
  });

  if ( $.url().param('q') ){
    $.cookie('q', $.url().param('q'), { expires: 1 });
  }

  if ( !$.cookie('lat') && !$.url().param('q') ) {
    $('#ask').modal();
  }
});
