import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "mapbox-gl";
import { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./Map.css";
import Tooltip from './../tooltip/index';
import { observer } from 'mobx-react-lite';
import { RootStoresContext } from "../../stores";
import mnDistricts from '../../data/mn/mn-districts.json'

// mapboxgl.accessToken = process.env.API_KEY;
mapboxgl.accessToken = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const Map = () => {

    const [hoveredDistrict, _setHoveredDistrict] = useState(null);
    const hoveredDistrictRef = useRef(hoveredDistrict);

    const setHoveredDistrict = (data: any) => {
        hoveredDistrictRef.current = data;
        _setHoveredDistrict(data);
    };


    const useStores = useContext(RootStoresContext).mapStore


    const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }));
    const mapContainer = useRef<any>(null);
    const [long, setLong] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);

    useEffect(() => {
        const map: any = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/outdoors-v11",
            center: [long, lat],
            zoom: zoom,
        });

        const coordinatesGeocoder: any = function (query: any) {
            const matches = query.match(
                /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
            );
            if (!matches) {
                return null;
            }

            function coordinateFeature(lng: any, lat: any) {
                return {
                    center: [lng, lat],
                    geometry: {
                        type: "Point",
                        coordinates: [lng, lat],
                    },
                    place_name: "Lat: " + lat + " Lng: " + lng,
                    place_type: ["coordinate"],
                    properties: {},
                    type: "Feature",
                };
            }

            const coord1 = Number(matches[1]);
            const coord2 = Number(matches[2]);
            const geocodes = [];

            if (coord1 < -90 || coord1 > 90) {
                // must be lng, lat
                geocodes.push(coordinateFeature(coord1, coord2));
            }

            if (coord2 < -90 || coord2 > 90) {
                // must be lat, lng
                geocodes.push(coordinateFeature(coord2, coord1));
            }

            if (geocodes.length === 0) {
                // else could be either lng, lat or lat, lng
                geocodes.push(coordinateFeature(coord1, coord2));
                geocodes.push(coordinateFeature(coord2, coord1));
            }

            return geocodes;
        };
        map.addControl(new mapboxgl.NavigationControl());
        
        map.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                localGeocoder: coordinatesGeocoder,
                zoom: 10,
                placeholder: "Try: -40, 170",
                reverseGeocode: true,
            })
        );

        map.on("load", () => {

            map.addSource('district-source', {
                'type': 'geojson',
                'data': mnDistricts
            });

            map.addLayer({
                'id': 'district-layer',
                'type': 'fill',
                'source': 'district-source',
                'layout': {},
                'paint': {
                    'fill-color': [
                        'match',
                        ['get', 'CD116FP'],
                        '01',
                        '#5AA5D7',
                        '02',
                        '#02735E',
                        '03',
                        '#00E0EF',
                        '04',
                        '#84D0D9',
                        '05',
                        '#202359',
                        '06',
                        '#CE7529',
                        '07',
                        '#00AE6C',
                        '08',
                        '#0056A3',
                        /* other */ '#ffffff'
                    ],
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        .8,
                        0.5
                    ]
                }
            });

            map.on('mousemove', 'district-layer', function (e: any) {
                if (e.features.length > 0) {
                    if (hoveredDistrictRef.current && hoveredDistrictRef.current > -1) {

                        map.setFeatureState(
                            { source: 'district-source', id: hoveredDistrictRef.current },
                            { hover: false }
                        );
                    }

                    const  _hoveredDistrict = e.features[0].id;

                    map.setFeatureState(
                        { source: 'district-source', id: _hoveredDistrict },
                        { hover: true }
                    );

                    setHoveredDistrict(_hoveredDistrict);
                }

            });

            // When the mouse leaves the state-fill layer, update the feature state of the
            // previously hovered feature.
            map.on('mouseleave', 'district-layer', function () {
                if (hoveredDistrictRef.current) {
                    map.setFeatureState(
                        { source: 'district-source', id: hoveredDistrictRef.current },
                        { hover: false }
                    );
                }
                setHoveredDistrict(null);
            });


            //line
            //contour default min zoom 9
            map.addLayer({
                id: "biengioi",
                type: "line",
                source: {
                    type: "vector",
                    url: "mapbox://mapbox.mapbox-terrain-v2",
                },
                "source-layer": "contour",
            });
            //add source
            map.addSource("points", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "Point",
                                coordinates: [long, lat],
                            },
                        },
                        {
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "Point",
                                coordinates: [-long, -lat],
                            },
                        },
                        {
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "Point",
                                coordinates: [-91.3403, 0.0164],
                            },
                        },
                    ],
                },
            });

            map.addLayer({
                metadata: {
                    id: "marker",
                },
                id: "circle",
                type: "circle",
                source: "points",
                paint: {
                    "circle-color": "#4264fb",
                    "circle-radius": 8,
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff",
                },
            });
        });
        map.on("click", function (e: any) {
            useStores.arrMarker.map((ele: any) => ele.remove(map));
            const a: any = new mapboxgl.Marker(e).setLngLat(e.lngLat);
            a.addTo(map);
            useStores.arrMarker.push(a);
            // var feature = features[0];
            // console.log(feature);
            // new mapboxgl.Popup({ offset: [0, -15] })
            //   .setLngLat(feature.geometry.coordinates)
            //   .setHTML("<h3>" + feature.properties.title + "abc" + "</h3>")
            //   .addTo(map);
        });

        map.on("click", "circle", (e: any) => {
            map.flyTo({
                center: e.features[0].geometry.coordinates,
            });
        });

        map.on("mouseenter", "circle", () => {
            map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "circle", () => {
            map.getCanvas().style.cursor = "";
        });

        map.on("mousemove", (e: any) => {
            const features = map.queryRenderedFeatures(e.point);
            if (features.length) {
                const feature = features[0];

                const tooltipNode = document.createElement("div");
                ReactDOM.render(<Tooltip feature={feature} />, tooltipNode);

                tooltipRef.current
                    .setLngLat(e.lngLat)
                    .setDOMContent(tooltipNode)
                    .addTo(map);
            }
        });
        ///set sidebar
        map.on("move", () => {
            setLong(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });

        return ()=> map.remove();
    }, []);

    return (
        <div>
            <div className="sidebar">

            </div>
            <div className="map-container" ref={mapContainer} />
        </div>
    );
};

export default observer(Map);
