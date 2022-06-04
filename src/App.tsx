import { useEffect } from 'react';
import Map from './components/map';
import qs from 'qs';
import map, { AuthAPI, endpoints } from './api/map';
export default function App() {

  useEffect(() => {
    getAccessToken()
  }, [])

  const getAccessToken = async () => {
    try {
      await map.get(endpoints['layer']).then(res => console.log(res))
    } catch (error) {
      console.log(error);
    }
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
      let response = await AuthAPI(options);
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
