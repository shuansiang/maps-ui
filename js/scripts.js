$(document).ready(function(){
  initialiseMap();

  $("#welcome-modal").modal({
    backdrop: 'static',
    keyboard: false
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
  	$("#pickup").val($("#modal-pickup").val())
  	$("#dropoff").val($("#modal-dropoff").val())

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
var markerBounds, markers = [];
var map;


function initialiseMap() {
  var singapore = { lat: 1.354763, lng: 103.8203483 };

  map = new google.maps.Map(document.getElementById("googleMap"), {
    center: singapore,
    zoom: 12
  });

  var navAutocompletePickup = new google.maps.places.Autocomplete(document.getElementById('pickup'), {types: ['geocode'], componentRestrictions: {country: "sg"}});
  var navAutocompleteDropoff = new google.maps.places.Autocomplete(document.getElementById('dropoff'), {types: ['geocode'], componentRestrictions: {country: "sg"}});
  var modalAutocompletePickup = new google.maps.places.Autocomplete(document.getElementById('modal-pickup'), {types: ['geocode'], componentRestrictions: {country: "sg"}});
  var modalAutocompleteDropoff = new google.maps.places.Autocomplete(document.getElementById('modal-dropoff'), {types: ['geocode'], componentRestrictions: {country: "sg"}});
}

function clearAllMarkers() {
  for (var i=0; i<markers.length; i++) {
    markers[i].setMap(null);
  }
}

function getLocations(form) {
	var geocoder = new google.maps.Geocoder();

	if (form === "nav") {
	  geocoder.geocode({ "address": $("#pickup").val() }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        pickupLat = results[0].geometry.location.lat();
        pickupLng = results[0].geometry.location.lng();

        geocoder.geocode({ "address": $("#dropoff").val() }, function(results, status) {
		      if (status == google.maps.GeocoderStatus.OK) {
		        dropoffLat = results[0].geometry.location.lat();
		        dropoffLng = results[0].geometry.location.lng();
				 		placeMarkers();
		      }
		    });
      }
    });
	} else if (form === "modal") {	
  	geocoder.geocode({ "address": $("#modal-pickup").val() }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        pickupLat = results[0].geometry.location.lat();
        pickupLng = results[0].geometry.location.lng();

        geocoder.geocode({ "address": $("#modal-dropoff").val() }, function(results, status) {
		      if (status == google.maps.GeocoderStatus.OK) {
		        dropoffLat = results[0].geometry.location.lat();
		        dropoffLng = results[0].geometry.location.lng();
				 		placeMarkers();
		      }
		    });
      }
    });
	}
}

function placeMarkers() {
	markerBounds = new google.maps.LatLngBounds();
	createMarker(pickupLat, pickupLng, "pickup");
	createMarker(dropoffLat, dropoffLng, "dropoff");
  map.fitBounds(markerBounds);
}

function createMarker(lat, lng, type) {
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
  markerBounds.extend(position);
  markers.push(marker);
}
