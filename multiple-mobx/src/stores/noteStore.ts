import { RootStore } from './index';
// src/stores/note.store.js

import { makeAutoObservable } from "mobx";

interface INote {
    note: string;
    username : string;    
}

class noteStore {
    notes: INote[] = [];

    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    addNote(note: string , username : string) {
        let a = {note , username}
        this.notes.push(a);
    }
}

export default noteStore;
