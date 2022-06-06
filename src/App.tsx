import { useEffect } from 'react';
import Map from './components/map';
import qs from 'qs';
import mapAPI, { AuthAPI, endpoints } from './api/mapAPI';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import './App.css'

export default function App() {

  useEffect(() => {
    getAccessToken()
  }, [])

  const getAccessToken = async () => {
    
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({
        "grant_type": "password",
        "username": "admin",
        "password": "Vbd@329331LTK"
      }),
    };

    try {
      const response = await AuthAPI(options);
      localStorage.setItem("access_token", response.data.access_token)
    } catch (error: any) {
      console.log(error);
    }
  }


  return <>
    <div>
      <Map />
    </div>
  </>
}
