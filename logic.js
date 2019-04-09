var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

function markerSize(mag) {
  return mag*25000;
}

d3.json(url, function(response) {

  var len = response.features.length;

  console.log(response);

  var earthquake = [];

  function magColor(mag) {
    if (mag < 1){
      return "Chartreuse";
    }
    else 
      if (mag <= 2) {
        return "yellow";
      }
      else  
        if (mag <= 3) {
          return "gold";
        }
        else
          if (mag <= 4) {
            return "orange";
          }
          else  
            if (mag <= 5) {
              return "darkOrange"
            }
            else {
              return "red";
            }
  };

  // Iterate over the earthquake locations
  for (var i = 0; i < len; i++) {
    var location = response.features[i].geometry;

    console.log(location);

    // Add circles for each coordinate, the size and color will vary based on magnitude
    if (location) {
      L.circle([location.coordinates[1], location.coordinates[0]], {
        fillOpacity: 0.7,
        color: magColor(response.features[i].properties.mag),
        fillColor: magColor(response.features[i].properties.mag),
        radius: markerSize(response.features[i].properties.mag)
      })
      .bindPopup("<h3> Magnitude: " + response.features[i].properties.mag + "<br> Place: " + response.features[i].properties.place + "<br> </h3>")
      .addTo(myMap);
    }
  }

  // Create and add a legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var limits = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    var colors = ["Chartreuse","yellow","gold","orange","darkOrange","red"];
    var labels = [];

    div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
      <div class="max">' + limits[limits.length - 1] + '</div></div>'
    
    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div;
}
legend.addTo(myMap);

});