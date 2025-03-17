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

// // Append geocoder variable to goeocoder HTML div to position on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


/*--------------------------------------------------------------------
Step 2: VIEW GEOJSON POINT DATA ON MAP
--------------------------------------------------------------------*/
//HINT: Create an empty variable
//      Use the fetch method to access the GeoJSON from your online repository
//      Convert the response to JSON format and then store the response in your new variable

let Collisions = data;

map.on('load', () => {
    // Fetch and display Collisions data
    fetch('https://raw.githubusercontent.com/Typholison-byte/GGR472-Lab-4/main/data/pedcyc_collision_06-21.geojson')
        .then(response => response.json())
        .then(data => {
            console.log("Collision Data:", data);
            map.addSource('collisions', {
                type: 'geojson',
                data: data
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
});


    /*--------------------------------------------------------------------
        Step 3: CREATE BOUNDING BOX AND HEXGRID
    --------------------------------------------------------------------*/
    //HINT: All code to create and view the hexgrid will go inside a map load event handler
    //      First create a bounding box around the collision point data
    //      Access and store the bounding box coordinates as an array variable
    //      Use bounding box coordinates as argument in the turf hexgrid function
    //      **Option: You may want to consider how to increase the size of your bbox to enable greater geog coverage of your hexgrid
    //                Consider return types from different turf functions and required argument types carefully here

    // const collisionData = await collisionJsonPromise;
    // const envelope = turf.envelope(collisionData);

    // const bboxscaled = turf.bbox(turf.transformScale(envelope, 1.1));
    // const hexGrid = turf.hexGrid(bboxscaled, 0.5, { units: "kilometers" });

    /*--------------------------------------------------------------------
    Step 4: AGGREGATE COLLISIONS BY HEXGRID
    --------------------------------------------------------------------*/
    //HINT: Use Turf collect function to collect all '_id' properties from the collision points data for each heaxagon
    //      View the collect output in the console. Where there are no intersecting points in polygons, arrays will be empty

    // const hexGridWithCollisions = turf.collect(hexGrid, collisionData, "_id", "collision_ids");
	// let maxCollisions = 0;
	// hexGridWithCollisions.features.forEach((feat, i) => {
	// 	feat.properties.count = feat.properties.collision_ids.length;
	// 	feat.id = i; 
	// 	if (feat.properties.count > maxCollisions) {
	// 		maxCollisions = feat.properties.count;
	// 	}
	// });

    // // Require id to identify it
    // collisionData.features.forEach((feat) => (feat.id = feat.properties._id));


    // /*--------------------------------------------------------------------
    // Step 5: FINALIZE YOUR WEB MAP
    // --------------------------------------------------------------------*/
    //HINT: Think about the display of your data and usability of your web map.
    //      Update the addlayer paint properties for your hexgrid using:
    //        - an expression
    //        - The COUNT attribute
    //        - The maximum number of collisions found in a hexagon
    //      Add a legend and additional functionality including pop-up windows


//     // Add the hexgrid as a GeoJSON source.
// 	map.addSource("hexgrid", {
// 		type: "geojson",
// 		data: hexGridWithCollisions,
// 	});

// 	// Add a layer for the hexgrid with a fill color expression based on the 'count' property.
// 	map.addLayer({
// 		id: "hexgrid-layer",
// 		type: "fill",
// 		source: "hexgrid",
// 		paint: {
// 			// Colour interpolated between yellow and red based on number of collisions relative to max
// 			"fill-color": [
// 				"interpolate",
// 				["linear"],
// 				["get", "count"],
// 				0,
// 				"#fef0d9",
// 				maxCollisions * 0.25,
// 				"#fdcc8a",
// 				maxCollisions * 0.5,
// 				"#fc8d59",
// 				maxCollisions * 0.75,
// 				"#e34a33",
// 				maxCollisions,
// 				"#d7301f",
// 			],
// 			// Make the hovered hexagon more transparent
// 			// Also make everything more transparent as you zoom in (to better see detail)
// 			"fill-opacity": [
// 				"interpolate",
// 				["linear"],
// 				["zoom"],
// 				10,
// 				["case", ["boolean", ["feature-state", "hover"], false], 0.5, 0.7],
// 				12,
// 				["case", ["boolean", ["feature-state", "hover"], false], 0.3, 0.5],
// 				14,
// 				["case", ["boolean", ["feature-state", "hover"], false], 0.1, 0.2],
// 				16,
// 				["case", ["boolean", ["feature-state", "hover"], false], 0.05, 0.1],
// 			],
// 			"fill-outline-color": "#ffffff", // White outline on hexagons
// 		},
// 		filter: ["!=", "count", 0], // Hide hexagons with no collisions
// 	});

// 	// Show the collision points as circles.
// 	map.addSource("collisions", {
// 		type: "geojson",
// 		data: collisionData,
// 	});
// 	map.addLayer({
// 		id: "collisions-layer",
// 		type: "circle",
// 		source: "collisions",
// 		paint: {
// 			// When hovering a point make it bigger
// 			"circle-radius": [
// 				"case",
// 				["boolean", ["feature-state", "hover"], false],
// 				8, // radius when hovered
// 				4, // default radius
// 			],
// 			// when hovering a point make it red instead of blue
// 			"circle-color": [
// 				"case",
// 				["boolean", ["feature-state", "hover"], false],
// 				"#ff0000", // color when hovered
// 				"#0000ff", // default color
// 			],
// 		},
// 	});
// });

// // Track the currently hovered collision point's id
// let hoveredCollisionId = null;

// // Change cursor when hovering over points
// map.on("mousemove", "collisions-layer", () => {
// 	map.getCanvas().style.cursor = "pointer";
// });
// map.on("mouseleave", "collisions-layer", () => {
// 	map.getCanvas().style.cursor = "";
// });

// // Create a popup for collision details
// const collisionPopup = new mapboxgl.Popup({
// 	closeButton: false,
// 	closeOnClick: false,
// });


    // LAST BIT NEEDED

    // map.on('load', () => {
    //     // Add a data source from a GeoJSON file 
    //     map.addSource('GO-Stations', {
    //         type: 'geojson',
    //         data: 'https://raw.githubusercontent.com/Typholison-byte/GGR472-Lab-3/refs/heads/main/Data/GO%20Stations.geojson' // Your URL to your buildings.geojson file 
    //     });

    //     // Add the layer to display the stations
    //     map.addLayer({
    //         'id': 'GO-Stations-layer',
    //         'type': 'circle',
    //         'source': 'GO-Stations',
    //         'paint': {
    //             'circle-radius': 6,
    //             'circle-color': 'green',
    //             'circle-stroke-width': 2,
    //             'circle-stroke-color': '#ffffff'
    //         }
    //     });

    //     // Pop-ups for GO Stations
    //     map.on('click', 'GO-Stations-layer', (e) => {
    //         new mapboxgl.Popup()
    //             .setLngLat(e.lngLat)
    //             .setHTML(`<b>GO-Station:</b> ${e.features[0].properties.name}`)
    //             .addTo(map);
    //     });
      

    /*--------------------------------------------------------------------
    CREATE LEGEND IN JAVASCRIPT
    --------------------------------------------------------------------*/
    //Declare array variables for labels and colours
    // const legendlabels = [
    //     'GO Stations',
    //     'Subway Lines',
    // ];

    // const legendcolours = [
    //     'green',
    //     'blue',
    // ];

    //Declare legend variable 
    // const legend = document.getElementById('popn-legend');

    // const layers = [
    //     { id: 'GO-Stations-layer', name: 'GO Stations', color: 'green' },
    //     { id: 'Subway-Lines-layer', name: 'Subway Lines', color: 'blue' },
    // ];

    // layers.forEach(layer => {
    //     const button = document.createElement('button');
    //     button.innerHTML = layer.name;
    //     button.style.backgroundColor = layer.color;
    //     button.style.color = 'white';
    //     button.style.margin = '5px';
    //     button.style.border = 'none';
    //     button.style.padding = '5px 10px';
    //     button.style.cursor = 'pointer';

    //     let visible = true;
    //     button.addEventListener('click', () => {
    //         visible = !visible;
    //         map.setLayoutProperty(layer.id, 'visibility', visible ? 'visible' : 'none');
    //         button.style.opacity = visible ? '1' : '0.5';
    //     });

    //     legend.appendChild(button);
    // });

    // Toggle legend visibility
    // document.getElementById('legendcheck').addEventListener('change', (e) => {
    //     legend.style.display = e.target.checked ? 'block' : 'none';
    // });

    // Dropdown filter to show specific transportation type
    // document.getElementById("boundary").addEventListener('change', (e) => {
    //     const selectedValue = e.target.value;

    //     map.setLayoutProperty('GO-Stations-layer', 'visibility', selectedValue === 'Ontario' ? 'visible' : 'none');
    //     map.setLayoutProperty('Subway-Lines-layer', 'visibility', selectedValue === 'Quebec' ? 'visible' : 'none');
    //     map.setLayoutProperty('Airports-layer', 'visibility', selectedValue === 'Yukon' ? 'visible' : 'none');
    // });

    //For each layer create a block to put the colour and label in
    // legendlabels.forEach((label, i) => {
    //     const colour = legendcolours[i];

    //     const item = document.createElement('div'); //each layer gets a 'row' - this isn't in the legend yet, we do this later
    //     const key = document.createElement('span'); //add a 'key' to the row. A key will be the colour circle

    //     key.className = 'legend-key'; //the key will take on the shape and style properties defined in css
    //     key.style.backgroundColor = colour; // the background color is retreived from teh layers array

    //     const value = document.createElement('span'); //add a value variable to the 'row' in the legend
    //     value.innerHTML = `${label}`; //give the value variable text based on the label

    //     item.appendChild(key); //add the key (colour cirlce) to the legend row
    //     item.appendChild(value); //add the value to the legend row

    //     legend.appendChild(item); //add row to the legend
    // });


    // /*--------------------------------------------------------------------
    // ADD INTERACTIVITY BASED ON HTML EVENT
    // --------------------------------------------------------------------*/

    // // 1) Add event listener which returns map view to full screen on button click using flyTo method
    // document.getElementById('returnbutton').addEventListener('click', () => {
    //     map.flyTo({
    //         center: [-79.5, 43.73],
    //         zoom: 3,
    //         essential: true
    //     });
    // });