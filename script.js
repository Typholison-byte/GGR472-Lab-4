/*--------------------------------------------------------------------
GGR472 LAB 4: Incorporating GIS Analysis into web maps using Turf.js 
--------------------------------------------------------------------*/

/*--------------------------------------------------------------------
Step 1: INITIALIZE MAP
--------------------------------------------------------------------*/
// Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoibGFrZWVyaWUiLCJhIjoiY201cG5nbmptMDM0eDJxb215YXB0OGV0ZSJ9.yGNd3OQ2HqXdTSTuJcD9ug'; // Add default public map token from your Mapbox account 

const map = new mapboxgl.Map({
    container: 'my-map', // map container ID 
    style: 'mapbox://styles/mapbox/streets-v12', // style URL 
    center: [-79.4, 43.715], // starting position [lng, lat] 
    zoom: 10.5, // starting zoom level
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

// Append geocoder variable to goeocoder HTML div to position on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

/*--------------------------------------------------------------------
Step 2: VIEW GEOJSON POINT DATA ON MAP
--------------------------------------------------------------------*/
//HINT: Create an empty variable
//      Use the fetch method to access the GeoJSON from your online repository
//      Convert the response to JSON format and then store the response in your new variable

// Declare variable to store collision data
let Collisions;

map.on('load', () => {
    fetch('https://raw.githubusercontent.com/Typholison-byte/GGR472-Lab-4/refs/heads/main/data/pedcyc_collision_06-21.geojson')
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
                    'circle-radius': 4,
                    'circle-color': 'red',
                    'circle-opacity': 0.8
                }
            });

            // **Step 3: Create Bounding Box and Hexgrid**
            /*--------------------------------------------------------------------
            Step 3: CREATE BOUNDING BOX AND HEXGRID
            --------------------------------------------------------------------*/
            //HINT: All code to create and view the hexgrid will go inside a map load event handler
            //      First create a bounding box around the collision point data
            //      Access and store the bounding box coordinates as an array variable
            //      Use bounding box coordinates as argument in the turf hexgrid function
            //      **Option: You may want to consider how to increase the size of your bbox to enable greater geog coverage of your hexgrid
            //      Consider return types from different turf functions and required argument types carefully here
            
            const bbox = turf.bbox(Collisions);
            const expandedBbox = [
                bbox[0] - 0.05, bbox[1] - 0.05,
                bbox[2] + 0.05, bbox[3] + 0.05
            ];
            const hexGrid = turf.hexGrid(expandedBbox, 0.5, { units: 'kilometers' });

            // **Step 4: Aggregate collisions by hexgrid**
            /*--------------------------------------------------------------------
            Step 4: AGGREGATE COLLISIONS BY HEXGRID
             --------------------------------------------------------------------*/
            //HINT: Use Turf collect function to collect all '_id' properties from the collision points data for each heaxagon
            //      View the collect output in the console. Where there are no intersecting points in polygons, arrays will be empty

            const collected = turf.collect(hexGrid, Collisions, '_id', 'point_ids');

            // **Filter out hexagons with no collision points**
            const filteredHexes = {
                type: "FeatureCollection",
                features: collected.features.filter(hex => hex.properties.point_ids.length > 0)
            };

            console.log("Filtered Hexgrid:", filteredHexes);

            // Adding hexgrid layer
            map.addSource('hexgrid', {
                type: 'geojson',
                data: filteredHexes
            });

            map.addLayer({
                id: 'hexgrid-layer',
                type: 'fill',
                source: 'hexgrid',
                paint: {
                    'fill-color': 'turquoise',
                    'fill-opacity': 0.3,
                    'fill-outline-color': 'black'
                }
            });
        })
        .catch(error => console.error("Error fetching Collision data:", error));
});


// /*--------------------------------------------------------------------
// Step 5: FINALIZE YOUR WEB MAP
// --------------------------------------------------------------------*/
//HINT: Think about the display of your data and usability of your web map.
//      Update the addlayer paint properties for your hexgrid using:
//        - an expression
//        - The COUNT attribute
//        - The maximum number of collisions found in a hexagon
//      Add a legend and additional functionality including pop-up windows

// Adding Return Button
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.4, 43.715],
        zoom: 10.5,
        essential: true
    });
});

/* Adding LEGEND and styling */
const legendlabels = [
    'Collisions', 
    'Areas'
];

const legendcolours = [
    'red', 
    'turquoise'
];

const legend = document.getElementById('legend');

legendlabels.forEach((label, i) => {
    const colour = legendcolours[i];

    const item = document.createElement('div');
    const key = document.createElement('span');

    key.className = 'legend-key';
    key.style.backgroundColor = colour;

    const value = document.createElement('span');
    value.innerHTML = `${label}`;

    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
});


/*--------------------------------------------------------------------
ADD INTERACTIVITY FOR LAYER VISIBILITY
--------------------------------------------------------------------*/

// Change map layer display based on check box using setLayoutProperty method
document.getElementById('collision-points').addEventListener('change', (e) => {
    map.setLayoutProperty('collision-points', 'visibility', e.target.checked ? 'visible' : 'none');
});

document.getElementById('hexgrid-layer').addEventListener('change', (e) => {
    map.setLayoutProperty('hexgrid-layer', 'visibility', e.target.checked ? 'visible' : 'none');
});

// Change display of legend based on check box
let legendcheck = document.getElementById('legendcheck');

legendcheck.addEventListener('click', () => {
    if (legendcheck.checked) {
        legendcheck.checked = true;
        legend.style.display = 'block';
    }
    else {
        legend.style.display = "none";
        legendcheck.checked = false;
    }
});
