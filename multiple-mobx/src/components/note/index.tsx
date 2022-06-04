import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { RootStoresContext } from '../../stores';

const NoteCPN = () => {


    const store = useContext(RootStoresContext);

    const [note, setNote] = useState("");

    const handleNoteChange = (e: any) => {
      e.preventDefault();
      const {
        target: { value }
      } = e;
  
      setNote(value);
    };
  
    const addNote = () => {
      store.noteStore.addNote(note, store.userStore.getUsername);
    };
    return <>
        <h2>Insert note</h2>
        <input type="text" value={note} onChange={handleNoteChange} />
        <button type="button" onClick={addNote}>
            Add note
        </button>
        <h2>Notes list</h2>
        {store.noteStore?.notes?.length ? (
            store.noteStore.notes.map((note, idx) => (
                <div key={idx}>
                    <h3>from {note.username}</h3>
                    <p>{note.note}</p>
                </div>
            ))
        ) : (
            <p>No note on the list</p>
        )}
    </>
};

export default observer(NoteCPN);