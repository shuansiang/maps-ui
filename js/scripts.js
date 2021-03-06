$(document).ready(function(){
  initialiseMap();

  $("#welcome-modal").modal({
    backdrop: 'static',
    keyboard: false
  });

  $("#modal-pickup, #modal-dropoff, #pickup, #dropoff").on('input', function(e) {
  	var input = $(e.currentTarget).val();
  	if (!input) {
  		return;
  	}
		service.getPlacePredictions({ input: input, componentRestrictions: {country: 'SG'} }, function(predictions, status) {
			var list = []
			for (i in predictions) {
				list.push(predictions[i].description)
			}

			$(e.currentTarget).autocomplete({
			  source: list
			});
		});
  });

  $("#modal-form").submit(function(e) {
  	e.preventDefault();

  	$("#modal-pickup").removeClass("error");
  	$("#modal-dropoff").removeClass("error");
    if (!$("#modal-pickup").val() || !$("#modal-dropoff").val()) {
    	if (!$("#modal-pickup").val()) {
	    	$("#modal-pickup").addClass("error");
	    }
	    if (!$("#modal-dropoff").val()) {
	    	$("#modal-dropoff").addClass("error");
	    }
      return;
    }
    
  	$(".overlay").fadeOut(1000);
  	$("#welcome-modal").modal('toggle');
  	$("#pickup").focus().val($("#modal-pickup").val())
  	$("#dropoff").focus().val($("#modal-dropoff").val()).blur()

	  setTimeout(function() {
	 		getLocations("modal");
	  }, 1000);
  });

  $("#nav-form").submit(function(e) {
    e.preventDefault();

  	$("#pickup").removeClass("error");
  	$("#dropoff").removeClass("error");
    if (!$("#pickup").val() || !$("#dropoff").val()) {
    	if (!$("#pickup").val()) {
	    	$("#pickup").addClass("error");
	    }
	    if (!$("#dropoff").val()) {
	    	$("#dropoff").addClass("error");
	    }
      return;
    }

    clearAllMarkers();
 		getLocations("nav");
  });
});

var pickupLat, pickupLng, dropoffLat, dropoffLng;
var pickupAddr, dropoffAddr;
var markerBounds, markers = [];
var map;
var service;

function initialiseMap() {
	service = new google.maps.places.AutocompleteService();
  var singapore = { lat: 1.354763, lng: 103.8203483 };

  map = new google.maps.Map(document.getElementById("googleMap"), {
    center: singapore,
    zoom: 12
  });
}

function clearAllMarkers() {
  for (var i=0; i<markers.length; i++) {
    markers[i].setMap(null);
  }
}

function getLocations(form) {
	var geocoder = new google.maps.Geocoder();

	if (form === "nav") {
	  geocoder.geocode({ "address": $("#pickup").val(), componentRestrictions: { country: 'SG' } }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        pickupLat = results[0].geometry.location.lat();
        pickupLng = results[0].geometry.location.lng();
        pickupAddr = results[0].formatted_address

        geocoder.geocode({ "address": $("#dropoff").val(), componentRestrictions: { country: 'SG' } }, function(results, status) {
		      if (status == google.maps.GeocoderStatus.OK) {
		        dropoffLat = results[0].geometry.location.lat();
		        dropoffLng = results[0].geometry.location.lng();
		        dropoffAddr = results[0].formatted_address
				 		placeMarkers();
		      }
		    });
      }
    });
	} else if (form === "modal") {	
  	geocoder.geocode({ "address": $("#modal-pickup").val(), componentRestrictions: { country: 'SG' } }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        pickupLat = results[0].geometry.location.lat();
        pickupLng = results[0].geometry.location.lng();
        pickupAddr = results[0].formatted_address

        geocoder.geocode({ "address": $("#modal-dropoff").val(), componentRestrictions: { country: 'SG' } }, function(results, status) {
		      if (status == google.maps.GeocoderStatus.OK) {
		        dropoffLat = results[0].geometry.location.lat();
		        dropoffLng = results[0].geometry.location.lng();
		        dropoffAddr = results[0].formatted_address
				 		placeMarkers();
		      }
		    });
      }
    });
	}
}

function placeMarkers() {
	markerBounds = new google.maps.LatLngBounds();
	createMarker(pickupLat, pickupLng, pickupAddr, "pickup");
	createMarker(dropoffLat, dropoffLng, dropoffAddr, "dropoff");
  map.fitBounds(markerBounds);
}

function createMarker(lat, lng, addr, type) {
	var iconBase = 'http://maps.google.com/mapfiles/kml/paddle/';
  var icons = {
    pickup: iconBase + 'A.png',
    dropoff: iconBase + 'B.png'
  };

  var position = new google.maps.LatLng(lat, lng);
	var marker = new google.maps.Marker({
    position: position,
    animation: google.maps.Animation.DROP,
    icon: icons[type],
    map: map
  });
  google.maps.event.addListener(marker, 'click', function() {
    new google.maps.InfoWindow({
      content: type.charAt(0).toUpperCase() + type.slice(1) + ' Location: ' + addr
    }).open(map, marker);
  });
  markerBounds.extend(position);
  markers.push(marker);
}
