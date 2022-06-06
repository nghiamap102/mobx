import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import mapAPI, { API_TOKEN } from "../../api/mapAPI";
import Tooltip from './../tooltip/index';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { RootStoresContext } from "src/stores";
import Popup from "../popup";
import qs from 'qs';
import { endpoints } from './../../api/mapAPI';

mapboxgl.accessToken = API_TOKEN;

const Map = () => {
    const mapBoxGl: any = mapboxgl

    const useStores = useContext(RootStoresContext).mapStore

    const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }))
    const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }));

    const mapContainer = useRef<any>();
    const [long, setLong] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);

    const [name, setname] = useState('')
    const [description, setDescription] = useState('')

    const [listLocation, setListlocation] = useState(useStores.listLocation)

    useEffect(() => {

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/outdoors-v11",
            center: [long, lat],
            zoom: zoom,
        });
        const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true,
                point: true,
                combine_features: true,
                line_string: true,
            },
            defaultMode: 'draw_polygon'
        });

        // interactive
        map.addControl(new mapboxgl.NavigationControl());
        //search
        map.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapBoxGl,
                marker: true,
                placeholder: "Give me a text",
                bbox: [140.999326, -37.571471, 159.209167, -28.085795],

            })
        );
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true,
            showUserLocation:true
        }));

        map.on("load", () => {

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
                                coordinates: [-long + 1, lat + 1],
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
        map.on("click", e => {
            const features = map.queryRenderedFeatures(e.point, {})
            if (features.length > 0) {
                const feature = features[0]
                // create popup node
                const popupNode = document.createElement("div")

                ReactDOM.render(
                    <Popup
                        changeName={changeName}
                        changeDescription={changeDescription}
                    />,
                    popupNode
                )
                popUpRef.current
                    .setLngLat(e.lngLat)
                    .setDOMContent(popupNode)
                    .addTo(map)
            }
        })


        map.on("click", "circle", (e: any) => {
            map.flyTo({
                center: e.features[0].geometry.coordinates,
            });
        });


        ///set sidebar
        map.on("move", () => {
            setLong(parseInt(map.getCenter().lng.toFixed(4)));
            setLat(parseInt(map.getCenter().lat.toFixed(4)));
            setZoom(parseInt(map.getZoom().toFixed(2)));
        });

        return () => map.remove();
    }, []);


    useEffect(() => {
        getListLocation()
    }, [])

    const getListLocation = async () => {
        const res = await mapAPI.get(endpoints['node'])
        if (res.data.data) {
            const a = res.data.data?.map((ele: any) => ele)
            setListlocation([...a])
        }
    }


    const changeName = (e: any) => {
        const { value } = e.target.value
        setname(value)
    }

    const changeDescription = (e: any) => {
        const { value } = e.target.value
        setDescription(value)
    }

    const submitChange = async () => {
        try {


        } catch (error) {
            console.log(error);
        }
    }

    const fly = () => {
        console.log('abc');
        setLong(10)
        setLat(20)
    }

    return (
        <div>
            {/* <div className="locationInfo">
                Longitude: {long} | Latitude: {lat} | Zoom: {zoom}
            </div> */}
            <div className="sidebar">
                {listLocation.map((ele: any, index: number) => (
                    <div key={index + ' a'} onClick={fly}>
                        {ele.Title}
                    </div>
                ))}
            </div>
            <div className="map-container" ref={mapContainer} />
            <div className="control">
                <button onClick={submitChange} type="button" className="btn btn-primary">Save</button>
            </div>
        </div>
    );
};

export default observer(Map);
