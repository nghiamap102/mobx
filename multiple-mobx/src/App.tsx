import { useContext, useState } from "react";
import { useObserver } from "mobx-react";
import { StoresContext } from "./stores";
import UserCpn from './components/user/index'

export default function App() {
  // here you can access all of the stores registered on the root store
  const useStores = () => useContext(StoresContext);

  const { noteStore, userStore } = useStores();
  const [note, setNote] = useState("");

  // tracking the name change

  // tracking the note change
  const handleNoteChange = (e: any) => {
    e.preventDefault();
    const {
      target: { value }
    } = e;

    setNote(value);
  };

  const addNote = () => {
    // access the note store action adding note to the notes array
    noteStore.addNote(note, userStore.getUsername);
  };

  // since we want to observe the change in name and list, useObserver is required, otherwise, we can straightaway return jsx
  return useObserver(() => (
    <div className="App">
    
      <UserCpn/>

      <h2>Insert note</h2>
      <input type="text" value={note} onChange={handleNoteChange} />
      <button type="button" onClick={addNote}>
        Add note
      </button>

      <h2>Notes list</h2>
      {noteStore?.notes?.length ? (
        noteStore.notes.map((note, idx) => (
          <div key={idx}>
            <h3>from {note.username}</h3>
            <code>{note.note}</code>
          </div>
        ))
      ) : (
        <p>No note on the list</p>
      )}
    </div>
  ));
}
