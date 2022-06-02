import { useObserver } from "mobx-react-lite";
import NoteCPN from './components/note/index';
import UserCPN from './components/user/index';

export default function App() {


  return (
    <div className="App">
      <UserCPN />
      <NoteCPN />
    </div>
  );
}
