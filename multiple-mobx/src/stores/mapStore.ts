import { RootStore } from './index';

import { computed, makeAutoObservable } from "mobx";

interface IMarker {
    arrMarker: []
}

class MapStore {

    arrMarker: any[] = [];

    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    @computed get getArrMarker() {
        return this.arrMarker;
    }
}

export default MapStore;
