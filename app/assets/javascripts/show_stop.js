var ShowStopModel = Backbone.Model.extend({
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
var realtime_template = _.template('<table><% _.each(data, function(item) { %> <tr><td class="route"><%= item.Route %><%= item.Terminal %></td><td class="desc"><%= item.Description %></td><td class="time" style="color:<%= item.priority %>"><i><%= item.DepartureText %></i> </td></tr><% }); %></table>');

$(document).ready(function() {
  var id=$("#thestop").data().attr;
  var showstop_model = new ShowStopModel({ id: id, dataType: 'jsonp' });
  showstop_model.fetch({ success: got_data });
  
  // Callback on realtime model.
  function got_data(model, data) {
    if(data.length==0){
      $("#result").parent().html("No buses found.");   
    }

    data=_.map(data,
      function(obj) {
        var seconds=obj.DepartureTime.substr(6,10);
        var offset=obj.DepartureTime.substr(19,3);

        obj.arrtime=moment(seconds, "X");
        var ctime=moment();

        var dtime=(obj.arrtime-ctime)/1000/60; //Convert to minutes
        console.log(dtime);

        if(dtime<5)
          obj.priority="#B94A48";
        else if (dtime<15)
          obj.priority="#F89406";
        else if (dtime<20)
          obj.priority="#468847";
        else
          obj.priority="#000080";

        if(obj.DepartureText=="Due")
          obj.DepartureText="Now";

        if(obj.DepartureText.indexOf(":")!=-1)
          obj.DepartureText=obj.arrtime.format("h:mma");

        if(dtime<20 && obj.DepartureText.indexOf(":")!=-1)
          obj.DepartureText+='&nbsp;<i title="Bus scheduled, no real-time data available." class="icon-question-sign"></i>';

        console.log(obj.priority);

        return obj;
      }
    );
    data=_.sortBy(data,function(obj) { return obj.arrtime; });
    data=_.filter(data,function(obj) {
      return obj.DepartureText=obj.DepartureText;
    });
    $("#result").html( realtime_template({ data: data }) );
  }
});
