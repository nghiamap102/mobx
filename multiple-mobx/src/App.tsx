import Map from './components/map';
import NoteCPN from './components/note/index';
import TodoList from './components/todo/index';
import UserCPN from './components/user/index';
import { useEffect } from 'react';
import axios, { Axios } from 'axios';


export default function App() {

  useEffect(()=>{
    console.log();
    
  },[])

  return <>
  <div>
    <Map />
  </div>
  </>
  {/* <UserCPN />
      <NoteCPN />
      <TodoList/> */}
}
