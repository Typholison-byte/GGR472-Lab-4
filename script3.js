/*--------------------------------------------------------------------
Step 1: INITIALIZE MAP
--------------------------------------------------------------------*/
// Define access token

mapboxgl.accessToken = 'pk.eyJ1IjoibGFrZWVyaWUiLCJhIjoiY201cG5nbmptMDM0eDJxb215YXB0OGV0ZSJ9.yGNd3OQ2HqXdTSTuJcD9ug'; // Add default public map token from your Mapbox account 

const map = new mapboxgl.Map({
    container: 'my-map', // map container ID 
    style: 'mapbox://styles/mapbox/streets-v12', // style URL 
    center: [-79.5, 43.73], // starting position [lng, lat] 
    zoom: 9, // starting zoom level
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Add geolocate control to the map.
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true }, // uses the most accuarate location available form user's device
    trackUserLocation: true //Shows users location on map (with permission from user)
}));

// Add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());

// Create geocoder as a variable (and remove previous geocoder)
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca"
});


// Create empty variables
let GOStations;
let Collisions;

// Fetch and display GO Stations data
fetch('https://raw.githubusercontent.com/Typholison-byte/GGR472-Lab-4/refs/heads/main/data/GO%20Stations.geojson?token=GHSAT0AAAAAAC53S4GDCFJHFPRIXBOWLRBWZ6YNQ6Q')
    .then(response => response.json())
    .then(data => {
        console.log("GO Stations Data:", data);
        GOStations = data;

        map.addSource('go-stations', {
            type: 'geojson',
            data: GOStations
        });

        map.addLayer({
            id: 'go-stations-layer',
            type: 'circle',
            source: 'go-stations',
            paint: {
                'circle-radius': 6,
                'circle-color': '#007cbf',
                'circle-opacity': 0.8
            }
        });
    })
    .catch(error => console.error("Error fetching GO Stations data:", error));

// Fetch and display Collisions data
fetch('https://raw.githubusercontent.com/Typholison-byte/GGR472-Lab-4/refs/heads/main/data/pedcyc_collision_06-21.geojson?token=GHSAT0AAAAAAC53S4GCQBE5OQ6P4SIMJJKYZ6YN3EQ')
    .then(response => response.json())
    .then(data => {
        console.log("Collision Data:", data);
        Collisions = data;

        map.addSource('collisions', {
            type: 'geojson',
            data: Collisions
        });

        map.addLayer({
            id: 'collision-points',
            type: 'circle',
            source: 'collisions',
            paint: {
                'circle-radius': 5,
                'circle-color': '#FF0000',
                'circle-opacity': 0.7
            }
        });
    })
    .catch(error => console.error("Error fetching Collision data:", error));






// // Append geocoder variable to goeocoder HTML div to position on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

map.on('load', () => {
    // Add a data source from a GeoJSON file 
    map.addSource('GO-Stations', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/Typholison-byte/GGR472-Lab-3/refs/heads/main/Data/GO%20Stations.geojson' // Your URL to your buildings.geojson file 
    });

    // Add the layer to display the stations
    map.addLayer({
        'id': 'GO-Stations-layer',
        'type': 'circle',
        'source': 'GO-Stations',
        'paint': {
            'circle-radius': 6,
            'circle-color': 'green',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });

    // Pop-ups for GO Stations
    map.on('click', 'GO-Stations-layer', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<b>GO-Station:</b> ${e.features[0].properties.name}`)
            .addTo(map);
    });

    // Add a data source from a GeoJSON file
    map.addSource('GGR472_Subway_Lines', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/Typholison-byte/GGR472-Lab-3/refs/heads/main/Data/GGR472_Subway_Lines.geojson' // Your URL to your buildings.geojson file 
    });

    // Adding layer for subway lines
    map.addLayer({
        id: 'Subway-Lines-layer',
        type: 'line',
        source: 'GGR472_Subway_Lines',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': 'turquoise',
            'line-width': 3,
            'line-opacity': 0.8
        }
    });

    // Pop-ups for Subway Lines
    map.on('click', 'Subway-Lines-layer', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<b>Subway Line:</b> ${e.features[0].properties.name}`)
            .addTo(map);
    });

    // Toggle layers button
    document.getElementById('toggle-subway').addEventListener('click', () => {
        const visibility = map.getLayoutProperty('Subway-Lines-layer', 'visibility');
        map.setLayoutProperty('Subway-Lines-layer', 'visibility', visibility === 'visible' ? 'none' : 'visible');
    });


    // Add a data source from a GeoJSON file
    map.addSource('Airports', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/Typholison-byte/GGR472-Lab-3/refs/heads/main/Data/airports.geojson' // URL to your airports.geojson file 
    });

    // Adding layer for airports
    map.addLayer({
        id: 'Airports-layer', // Unique layer ID
        type: 'fill',  // Must be 'fill' for polygons
        source: 'Airports', // Corrected source ID
        paint: {
            'fill-color': 'purple',
            'fill-opacity': 0.5, // Adjusted opacity for visibility
            'fill-outline-color': '#000000' // Black outline for contrast
        }
    });

    // Pop-ups for Airports
    map.on('click', 'Airports-layer', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<b>Airport:</b> ${e.features[0].properties.name}`)
            .addTo(map);
    });

});

/*--------------------------------------------------------------------
CREATE LEGEND IN JAVASCRIPT
--------------------------------------------------------------------*/
//Declare array variables for labels and colours
const legendlabels = [
    'GO Stations',
    'Subway Lines',
];

const legendcolours = [
    'green',
    'blue',
];

//Declare legend variable 
const legend = document.getElementById('popn-legend');

const layers = [
    { id: 'GO-Stations-layer', name: 'GO Stations', color: 'green' },
    { id: 'Subway-Lines-layer', name: 'Subway Lines', color: 'blue' },
];

layers.forEach(layer => {
    const button = document.createElement('button');
    button.innerHTML = layer.name;
    button.style.backgroundColor = layer.color;
    button.style.color = 'white';
    button.style.margin = '5px';
    button.style.border = 'none';
    button.style.padding = '5px 10px';
    button.style.cursor = 'pointer';

    let visible = true;
    button.addEventListener('click', () => {
        visible = !visible;
        map.setLayoutProperty(layer.id, 'visibility', visible ? 'visible' : 'none');
        button.style.opacity = visible ? '1' : '0.5';
    });

    legend.appendChild(button);
});

// Toggle legend visibility
document.getElementById('legendcheck').addEventListener('change', (e) => {
    legend.style.display = e.target.checked ? 'block' : 'none';
});

// Dropdown filter to show specific transportation type
document.getElementById("boundary").addEventListener('change', (e) => {
    const selectedValue = e.target.value;

    map.setLayoutProperty('GO-Stations-layer', 'visibility', selectedValue === 'Ontario' ? 'visible' : 'none');
    map.setLayoutProperty('Subway-Lines-layer', 'visibility', selectedValue === 'Quebec' ? 'visible' : 'none');
    map.setLayoutProperty('Airports-layer', 'visibility', selectedValue === 'Yukon' ? 'visible' : 'none');
});

//For each layer create a block to put the colour and label in
legendlabels.forEach((label, i) => {
    const colour = legendcolours[i];

    const item = document.createElement('div'); //each layer gets a 'row' - this isn't in the legend yet, we do this later
    const key = document.createElement('span'); //add a 'key' to the row. A key will be the colour circle

    key.className = 'legend-key'; //the key will take on the shape and style properties defined in css
    key.style.backgroundColor = colour; // the background color is retreived from teh layers array

    const value = document.createElement('span'); //add a value variable to the 'row' in the legend
    value.innerHTML = `${label}`; //give the value variable text based on the label

    item.appendChild(key); //add the key (colour cirlce) to the legend row
    item.appendChild(value); //add the value to the legend row

    legend.appendChild(item); //add row to the legend
});


// /*--------------------------------------------------------------------
// ADD INTERACTIVITY BASED ON HTML EVENT
// --------------------------------------------------------------------*/

// // 1) Add event listener which returns map view to full screen on button click using flyTo method
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.5, 43.73],
        zoom: 3,
        essential: true
    });
});



// // 2) Change display of legend based on check box
// let legendcheck = document.getElementById('legendcheck');

// legendcheck.addEventListener('click', () => {
//     if (legendcheck.checked) {
//         legendcheck.checked = true;
//         legend.style.display = 'block';
//     }
//     else {
//         legend.style.display = "none";
//         legendcheck.checked = false;
//     }
// });


// // 3) Change map layer display based on check box using setLayoutProperty method
// document.getElementById('layercheck').addEventListener('change', (e) => {
//     map.setLayoutProperty(
//         'provterr-fill',
//         'visibility',
//         e.target.checked ? 'visible' : 'none'
//     );
// });


// // 4) Filter data layer to show selected Province from dropdown selection
// let boundaryvalue;

// document.getElementById("boundaryfieldset").addEventListener('change', (e) => {
//     boundaryvalue = document.getElementById('boundary').value;

//     //console.log(boundaryvalue); // Useful for testing whether correct values are returned from dropdown selection

//     if (boundaryvalue == 'All') {
//         map.setFilter(
//             'provterr-fill',
//             ['has', 'PRENAME'] // Returns all polygons from layer that have a value in PRENAME field
//         );
//     } else {
//         map.setFilter(
//             'provterr-fill',
//             ['==', ['get', 'PRENAME'], boundaryvalue] // returns polygon with PRENAME value that matches dropdown selection
//         );
//     }

// });