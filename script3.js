/*--------------------------------------------------------------------
Step 1: INITIALIZE MAP
--------------------------------------------------------------------*/
// Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoibGFrZWVyaWUiLCJhIjoiY201cG5nbmptMDM0eDJxb215YXB0OGV0ZSJ9.yGNd3OQ2HqXdTSTuJcD9ug'; // Add default public map token from your Mapbox account 

const map = new mapboxgl.Map({
    container: 'my-map', // Map container ID
    style: 'mapbox://styles/mapbox/streets-v12', // Style URL
    center: [-79.4, 43.715], // Starting position [lng, lat]
    zoom: 10.5, // Starting zoom level
});

// Add zoom, rotation, geolocation, and fullscreen controls
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }));
map.addControl(new mapboxgl.FullscreenControl());

// Initialize geocoder
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca"
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

// Adding Return Button
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({ center: [-79.4, 43.715], zoom: 10.5, essential: true });
});

let Collisions;

map.on('load', () => {
    fetch('https://raw.githubusercontent.com/Typholison-byte/GGR472-Lab-4/refs/heads/main/data/pedcyc_collision_06-21.geojson')
        .then(response => response.json())
        .then(data => {
            console.log("Collision Data:", data);
            Collisions = data;

            // Add Collision Points Layer
            map.addSource('collisions', { type: 'geojson', data: Collisions });
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

            // Create Hexgrid
            const bbox = turf.bbox(Collisions);
            const expandedBbox = [ bbox[0] - 0.05, bbox[1] - 0.05, bbox[2] + 0.05, bbox[3] + 0.05 ];
            const hexGrid = turf.hexGrid(expandedBbox, 0.5, { units: 'kilometers' });

            // Aggregate collisions in hexgrid
            const collected = turf.collect(hexGrid, Collisions, '_id', 'point_ids');
            const filteredHexes = {
                type: "FeatureCollection",
                features: collected.features.filter(hex => hex.properties.point_ids.length > 0)
            };

            console.log("Filtered Hexgrid:", filteredHexes);

            // Add Hexgrid Layer
            map.addSource('hexgrid', { type: 'geojson', data: filteredHexes });
            map.addLayer({
                id: 'hex-layer',
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

/* ADD LEGEND */
const legendlabels = ['Collisions', 'Collision Areas'];
const legendcolours = ['red', 'turquoise'];
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
✅ ADD INTERACTIVITY FOR LAYER VISIBILITY
--------------------------------------------------------------------*/

// Fix: Ensure IDs match checkboxes in HTML
document.getElementById('collision-check').addEventListener('change', (e) => {
    map.setLayoutProperty('collision-points', 'visibility', e.target.checked ? 'visible' : 'none');
});

document.getElementById('hexgrid-check').addEventListener('change', (e) => {
    map.setLayoutProperty('hex-layer', 'visibility', e.target.checked ? 'visible' : 'none');
});

// Fix: Legend Toggle Based on Checkbox
document.getElementById('legendcheck').addEventListener('change', function () {
    legend.style.display = this.checked ? 'block' : 'none';
});