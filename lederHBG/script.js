
const app = document.getElementById('root');
var lat, long, canvas;
var request = new XMLHttpRequest();
request.open('GET', 'https://helsingborg.opendatasoft.com/api/records/1.0/search/?dataset=leder&q=&facet=lednamn', true);

request.onload = function() {
    let dataset = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {
        // create div element to contain the trail list
        const mainDiv = document.createElement('div');
        const mapDiv = document.createElement('div');
        mainDiv.setAttribute('class', 'main_container');
        mapDiv.setAttribute('class', 'map_container');
        mapDiv.setAttribute('id', 'map_canvas');
        app.appendChild(mainDiv);
        app.appendChild(mapDiv);
        dataset.records.forEach(item => {
            // create button element for each trail
            const h3 = document.createElement('h3');
            h3.style.color = "blue";
            h3.textContent = "Leden Namn: ";
            mainDiv.appendChild(h3);

            // Create a <button> element with lednamn
            var btn = document.createElement("button");
            btn.innerHTML = item.fields.lednamn;

            // start - define event for button
            btn.addEventListener("click", () => {
                lat = item.fields.geo_point_2d[0];
                long =  item.fields.geo_point_2d[1];

                showMapLoc();
                drawShape(item.fields.geo_shape.coordinates);
            });
            // end - define event for button
            h3.appendChild(btn);        
        });
    }
    else{
        console.log('Fel');
    }
}

request.send();

let map;

function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            showMapLoc();
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function showMapLoc() {
    var myOptions = {
        center: new google.maps.LatLng(lat, long),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}
function drawShape(shapeCoords) {
  const map = new google.maps.Map(document.getElementById("map_canvas"), {
    zoom: 15,
    center: new google.maps.LatLng(lat, long),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var polygonCoords = [];
  for (var i = 0; i < shapeCoords.length; i++) {
      var pt = {lat: shapeCoords[i][1], lng: shapeCoords[i][0]};
      polygonCoords.push(pt);
    }
  // Construct the polygon.
  const shape = new google.maps.Polygon({
    paths: polygonCoords,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35
  });
  shape.setMap(map);
}