import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl, { Map } from "mapbox-gl";
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
import Validation from "src/utils/validation";

mapboxgl.accessToken = API_TOKEN;

const MapCPN = () => {
    const mapBoxGl: any = mapboxgl

    const useStores = useContext(RootStoresContext).mapStore

    const popUpRef = useRef(new mapboxgl.Popup({ offset: 15 }))
    const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }));
    const map = useRef<Map>();

    const mapContainer = useRef<any>();
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    // const [listLocation, setListlocation] = useState(useStores.listLocation)
    const [listLocation, setListlocation] = useState<any>([])


    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/outdoors-v11",
            center: [lng, lat],
            zoom: zoom,
        });

    }, []);


    useEffect(() => {
        getListLocation()
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
        });
        map.current?.on("click", e => {
            const features: any = map.current?.queryRenderedFeatures(e.point, {})
            setLat(e.lngLat.lat)
            setLng(e.lngLat.lng)
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


    const fly = (ele: any) => {
        console.log(ele.geo.lng);

        map.current?.flyTo({
            center: [ele.geo.lng, ele.geo.lat],
            zoom: 6,
            speed: 5
        });
        useStores.arrMarker.map((ele: any) => ele.remove(map.current));
        const a: any = new mapboxgl.Marker().setLngLat([ele.geo.lng, ele.geo.lat]);
        a.addTo(map.current)
        useStores.arrMarker.push(a)
    }

    const getListLocation = async () => {
        // const res = await mapAPI.get(endpoints['node'])
        // if (res.data.data) {
        //     const a = res.data.data?.map((ele: any) => ele)
        //     setListlocation([...a])
        // }
        setListlocation([{ Title: 'abc', geo: { lng: '10', lat: '20' } }, { Title: 'bcd', geo: { lng: '20.54874', lat: '10.012300' } }])
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
            console.log(title , description , lng , lat);
            
            // const options = {
            //     method: 'POST',
            //     data: {
            //         Path: '/root/vdms/tangthu/locationinfo',
            //         LayerData: {
            //             "Title": title,
            //             "Description": description,
            //             // eslint-disable-next-line no-useless-escape
            //             "geo": `{\"type\":\"Point\",\"coordinates\":[${lng},${lat}]}`
            //         }
            //     }
            // };
            // await mapAPI(endpoints['node'],options).then(res => console.log(res.data))

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
                {listLocation.map((ele: any, index: number) => (
                    <div key={index + ' a'} onClick={() => fly(ele)} className="items">
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

export default observer(MapCPN);
