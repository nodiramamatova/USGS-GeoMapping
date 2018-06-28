// Define a markerSize function that will give each marker a different radius based on its magnitude
function markerSize(magnitude) {
  return magnitude * 100000;
}

  // Link to GeoJSON
  var APILink =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
  
  var markerGroup = [];
  
  // Grabbing data with d3...
  d3.json(APILink, function(data) {
      
      for (var i = 0; i < data.features.length; i++) {
          var circle = L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: 'black',
            fillColor: 'purple',
            // Setting our circle's radius equal to the output of our markerSize function
            // This will make our marker's size proportionate to its population
            radius: markerSize(data.features[i].properties.mag)
          }).bindPopup(
              '<h2>' +
                data.features[i].properties.place +
                '</h2> <hr> <h3>Magnitude: ' +
                data.features[i].properties.mag +
                '</h3>'
                )
        // loop through the data array, create a new marker
        markerGroup.push(
          circle
        )
    }
  

    // Add all the cityMarkers to a new layer group.
    // Now we can handle them as one group instead of referencing each individually
    var eqLayer = L.layerGroup(markerGroup);

     // Adding tile layer
     var layer1 = L.tileLayer(
        'https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=' +
          'pk.eyJ1IjoiYmJ1Y2hha2UiLCJhIjoiY2podmJ4em9sMDNzODNxbWRhYjNhNm1kayJ9.bTCRxouRGxiRjhnmiR5leQ'
      );

    // Only one base layer can be shown at a time
    var baseMaps = {
        Light: layer1
      };

      // Overlays that may be toggled on or off
      var overlayMaps = {
        Earthquakes: eqLayer
      };

    // Creating map object
    var myMap = L.map('map-id', {
        center: [36.761526, 22.564117],
        zoom: 2,
        layers: [layer1, eqLayer]
      });

    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
      
    // Setting up the legend
     var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Earthquakes</strong>'],
    categories = ['Magnitude 4.5 and above'];

    for (var i = 0; i < categories.length; i++) {

            div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:purple"></i> ' +
            (categories[i] ? categories[i] : '+'));

        }
        div.innerHTML = labels.join('<br>');
    return div;
    };
    legend.addTo(myMap);

 });
