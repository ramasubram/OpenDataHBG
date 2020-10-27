const p2="";

const app = document.getElementById('root');
const container = document.createElement('div');
container.setAttribute('class', 'container');
app.appendChild(container);

var request = new XMLHttpRequest();
request.open('GET', 'https://helsingborg.opendatasoft.com/api/records/1.0/search/?dataset=leder&q=&facet=lednamn', true);

request.onload = function() {
    let dataset = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {
        dataset.records.forEach(item => {
            // create div for each item in the dataset
            const maindiv = document.createElement('div');
            maindiv.setAttribute('class', 'mainContainer');

            const h2 = document.createElement('h2');
            h2.style.color = "blue";
            h2.textContent = "Namn : ";


            container.appendChild(maindiv);
            maindiv.appendChild(h2);

            // Create a <button> element with lednamn
            var btn = document.createElement("button");
            btn.innerHTML = item.fields.lednamn;

            // start - define event for button
            btn.addEventListener("click", () => {
                showMapLoc(item.fields.geo_point_2d[0], item.fields.geo_point_2d[1]);
                ctx = canvas.getContext("2d");

                var minX,minY,maxX,maxY; 
                item.fields.geo_shape.coordinates.forEach((p,i) => {
                    if(i === 0){ // if first point 
                        minX = maxX = p[0];
                        minY = maxY = p[1]; 
                    }else{
                        minX = Math.min(p[0],minX);
                        minY = Math.min(p[1],minY);
                        maxX = Math.max(p[0],maxX);
                        maxY = Math.max(p[1],maxY);
                    }
                });

                // get the map width and heigth in its local coords
                const mapWidth = maxX-minX;
                const mapHeight = maxY-minY;
                const mapCenterX = (maxX + minX) /2;
                const mapCenterY = (maxY + minY) /2;
                console.log(ctx.canvas.width, ctx.canvas.height, mapWidth, mapHeight); 

                // to find the scale that will fit the canvas get the min scale to fit height or width
                const scale = Math.min(ctx.canvas.width / mapWidth,ctx.canvas.height / mapHeight);

                console.log(scale);
                // draw the map centered on the cavas
                ctx.beginPath();
                ctx.strokeStyle = 'blue';

                item.fields.geo_shape.coordinates.forEach(p => { 
                    ctx.lineTo(
                        (p[0] - mapCenterX) * scale + ctx.canvas.width /2 ,
                        (p[1] - mapCenterY) * scale + ctx.canvas.height / 2 
                    );
                });
                ctx.stroke();
            });
            // end - define event for button
            h2.appendChild(btn);        
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
            showMapLoc(lat, long);
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function showMapLoc(lat, long) {
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
