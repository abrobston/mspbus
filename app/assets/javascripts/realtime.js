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
var realtime_template = _.template('<% _.each(data, function(item) { %> <span class="label <%= item.priority %>"> <b><%= item.Route %><%= item.Terminal %></b> &ndash; <i><%= item.DepartureText %></i></span> <% }); %>');

var nodata_template = _.template('<span class="label">No data</span>');

$(document).ready(function() {

  // Loop over stops and get realtime data
  $(".real-time").each(function(index, item) {
    var realtime_model = new RealtimeModel({ id: item.id, dataType: 'jsonp' });
    realtime_model.fetch({ success: got_data });

  });
  
  // Callback on realtime model.
  function got_data(model, data) {
    if(data.length==0){
      $("#" + model.id).html( nodata_template() );
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

        if(dtime<20 && obj.DepartureText.indexOf(":")!=-1)
          obj.DepartureText=Math.round(dtime)+' Min <i title="Bus scheduled, no real-time data available." class="icon-question-sign"></i>';
        else if(dtime>=20)
          obj.DepartureText='>20 Min';

        return obj;
      }
    );

    data=_.sortBy(data,function(obj) { return obj.arrtime; });
    data=data.slice(0,5);

    $("#" + model.id).html( realtime_template({ data: data }) );
  }

  function got_coordiates(position) {
    $.cookie('lat', position.coords.latitude, { expires: 1 });
    $.cookie('lon', position.coords.longitude, { expires: 1 });

    window.location = '/';
    //window.location = '/?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude;
  }

  function error_on_coordinates() {
  	$('#ask').modal("hide");
  	$('#error').modal();
  }

  // Setup location handlers
  $('#btn-current-location').on('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(got_coordiates, error_on_coordinates);
    }
  });

  if ( !$.cookie('lat') ) {
    $('#ask').modal();
  }
});
