import { RootStore } from './index';

import { action, makeAutoObservable, observable } from "mobx";

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

    @action addNote(note: string , username : string) {
        let a = {note , username}
        this.notes.push(a);
    }
}

export default noteStore;
