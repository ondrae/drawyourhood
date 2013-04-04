// Get map ready to load
function initialize() {

  // Put the map on the page.
  var mapOptions = {
    center: new google.maps.LatLng(37.7639, -122.446),
    zoom: 14,
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };

  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  
  // Drop Google's neighborhood names
  var mapStyle = [{
    featureType: "administrative.neighborhood", stylers: [{ visibility: 'off' }]
  }];

  map.setOptions({styles: mapStyle});
  
  // Load up drawing library
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_LEFT,
      drawingModes: [google.maps.drawing.OverlayType.POLYGON]
    },

    polygonOptions: {
      fillColor: '#0099FF',
      fillOpacity: 0.7,
      strokeColor: '#AA2143',
      strokeWeight: 2,
      clickable: true,
      zIndex: 1,
      editable: true
    }
  });

  drawingManager.setMap(map);

  // Clear selection if the user clicks the map, not a hood
  var selectedShape;
  function clearSelection() {
    if (!selectedShape) return;
    selectedShape.setEditable(false);
    selectedShape = null;
  }

  // If they click on the map, clear all selections.
  google.maps.event.addListener(map, 'click', clearSelection);

  // Set current shape as the selected one.
  function setSelection(shape) {
    clearSelection();
    selectedShape = shape;
    shape.setEditable(true);
  }

  // When you finish drawing the polygon, deselect it. TODO: Add a id, name to the polygon.
  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {

      // Switch back to pan mode.
      drawingManager.setDrawingMode(null);

      var newShape = e.overlay;
      newShape.type = e.type;
      newShape.setEditable(false);

      //Find center of the polygon
      // http://stackoverflow.com/questions/3081021/how-to-get-the-center-of-a-polygon-in-google-maps-v3
      google.maps.Polygon.prototype.my_getBounds=function(){
          var bounds = new google.maps.LatLngBounds()
          this.getPath().forEach(function(element,index){bounds.extend(element)})
          return bounds
      }
      var someWeirdGoogleObject = newShape.my_getBounds().getCenter();
      var lat = someWeirdGoogleObject['jb'];
      var lng = someWeirdGoogleObject['kb'];
      var myLatlng = new google.maps.LatLng(lat,lng);
      
      // Add a name to the hood // Add a save button
      var content = "Hood Name: <input id=\"hoodName\" type=\"text\"></input>";
      $('#save').html('<button>Save</button>');
      $('#save').click(function(){
        var hoodName = escape(document.getElementById("hoodName").value);
        infowindow.close();
        console.log(hoodName);
        $('#save').css('display:none;');
      });
      var infowindow = new google.maps.InfoWindow({
          content: content
      });
      var marker = new google.maps.Marker({
          position: myLatlng,
          map: map
      });
      marker.setVisible(false);
      infowindow.open(map,marker);

      // If they click on the hood the drew, reselect it.
      google.maps.event.addListener(newShape, 'click', function(){
        setSelection(this);
      });

    });
}

google.maps.event.addDomListener(window, 'load', initialize);