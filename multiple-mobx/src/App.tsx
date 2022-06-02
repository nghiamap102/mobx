import NoteCPN from './components/note/index';
import TodoList from './components/todo/index';
import UserCPN from './components/user/index';

export default function App() {


  return (
    <div className="App">
      <UserCPN />
      <NoteCPN />
      <TodoList/>

    </div>
  );
}
