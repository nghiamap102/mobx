import { RootStore } from './index';

import { action, makeAutoObservable } from "mobx";
import mapAPI, { endpoints } from 'src/api/mapAPI';


class MapStore {

    listLocation :any[]= [];

    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    get getListLocation() {
        return this.listLocation;
    }

}

export default MapStore;
