/*  The code to my maps.js file was created using https://developers.arcgis.com/javascript/latest/sample-code/intro-mapview/ as a source! */

require(["esri/Map", "esri/views/MapView"], (Map, MapView) => {
    const map = new Map({
        basemap: "topo-vector"
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 6,
        center: [-4, 55]
    });
});