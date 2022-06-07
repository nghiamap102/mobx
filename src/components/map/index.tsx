import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl, { Map } from "mapbox-gl";
import { RulerControl, StylesControl } from 'mapbox-gl-controls';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useRef, useState } from "react";
import { RootStoresContext } from "src/stores";
import Validation from "src/utils/validation";
import mapAPI, { API_TOKEN, endpoints } from "../../api/mapAPI";
import Popup from '../popup';
import ReactDOM from "react-dom"
import Tooltip from '../tooltip';
import Helper from './../../utils/helper/index';


mapboxgl.accessToken = API_TOKEN;

const MapCPN = () => {


    const useStores = useContext(RootStoresContext).mapStore
    const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }))

    const map = useRef<Map>();
    const mapContainer = useRef<any>();
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')


    useEffect(() => {
        useStores.fetchListLocation();

        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/outdoors-v11",
            center: [lng, lat],
            zoom: zoom,
        });

    }, []);

    useEffect(() => {
        
        if (!map.current) return;
        map.current.on("load", () => {
            //line
            //contour default min zoom 9
            map.current?.addLayer({
                id: "biengioi",
                type: "line",
                source: {
                    type: "vector",
                    url: "mapbox://mapbox.mapbox-terrain-v2",
                },
                "source-layer": "contour",
            });
            //add source
            map.current?.addSource("points", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "Point",
                                coordinates: [lng, lat],
                            },
                        },
                        {
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "Point",
                                coordinates: [-lng, -lat],
                            },
                        },
                        {
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "Point",
                                coordinates: [-lng + 1, lat + 1],
                            },
                        },
                    ],
                },
            });

            map.current?.addLayer({
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

            const draw = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    trash: true,
                    point: true,
                },

                defaultMode: 'draw_polygon'
            });


            map.current?.addControl(draw, "top-right")
            map.current?.addControl(new RulerControl(), 'top-right');
            map.current?.addControl(new StylesControl(), 'top-right');
            map.current?.addControl(new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true,
                showUserLocation: true
            }));


            const mapBoxGl: any = mapboxgl
            map.current?.addControl(
                new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    mapboxgl: mapBoxGl,
                    marker: true,
                    placeholder: "Give me a text",
                }), "top-left"
            );
            map.current?.addControl(new mapboxgl.NavigationControl(), "top-right");
        });

        map.current?.on('draw.create', (e) => {

        })

        map.current.on("click", e => {
            const features: any = map.current?.queryRenderedFeatures(e.point, {})
            if (features.length > 0) {
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
                    .addTo(Validation.checkEmpty(map.current))
            }
        })

        map.current?.on("click", "circle", (e: any) => {
            map.current?.flyTo({
                center: e.features[0].geometry.coordinates,
            });
        });
    }, [lng, lat])

    // const newMarkder = (e: any) => {
    //     const el = document.createElement('div')
    //     el.style.width = "100px";
    //     el.style.height = "100px";
    //     el.style.borderRadius = "50%";
    //     el.style.backgroundColor = "rgb(22, 170, 255)";
    //     el.style.zIndex = "-1";
    //     const a = new mapboxgl.Marker(el).setLngLat(e.features[0].geometry.coordinates).addTo(Validation.checkEmpty(map.current))
    //     a.addTo(Validation.checkEmpty(map.current))
    //     return a
    // }

    const fly = (ele: any) => {
        console.log(ele);
        map.current?.flyTo({
            center: [ele[0], ele[1]],
            zoom: 6,
            speed: 5
        });
        useStores.arrMarker.map((ele: any) => ele.remove(map.current));
        const a: any = new mapboxgl.Marker().setLngLat(ele);
        a.addTo(map.current)
        useStores.arrMarker.push(a)
    }

    const changeName = (e: any) => {
        const { value } = e.target
        setTitle(value)
    }

    const changeDescription = (e: any) => {
        const { value } = e.target
        setDescription(value)
    }

    const submitChange = async () => {
        try {
            console.log(title, description, lng, lat);

            const options = {
                method: 'POST',
                data: {
                    Path: '/root/vdms/tangthu/data/locationinfo',
                    LayerData: {
                        "Title": title,
                        "Description": description,
                        // eslint-disable-next-line no-useless-escape
                        "geo": `{\"type\":\"Point\",\"coordinates\":[${lng},${lat}]}`
                    }
                }
            };
            await mapAPI(endpoints['node'], options).then(res => console.log(res.data))

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {/* <div className="locationInfo">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div> */}
            <div className="sidebar">
                {useStores.listLocation?.map((ele: any, index: number) => {
                    return (
                        <div key={index + ' a'} onClick={() => fly(Helper.getGeoLocation(ele))} className="items">
                            {ele.Title}
                        </div>
                    )
                })}
            </div>
            <div className="map-container" ref={mapContainer} />
            <div className="control">
                <button onClick={submitChange} type="button" className="btn btn-primary">Save</button>
            </div>
        </div>
    );
};

export default observer(MapCPN);
