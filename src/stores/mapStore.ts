import { RootStore } from './index';

import { action, makeAutoObservable, runInAction } from "mobx";
import mapAPI, { endpoints } from 'src/api/mapAPI';


class MapStore {

    listLocation: any[] = [];
    loading = false;
    arrMarker: any[] = [];
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    get getListLocation() {
        return this.listLocation;
    }

    @action async fetchListLocation() {
        this.listLocation = [];
        try {
            const res = await mapAPI.get(endpoints['node'])
            const data = await res.data.data
            runInAction(() => {
                this.listLocation = data
                this.loading = false
            })

        } catch (error) {
            runInAction(() => {
                this.loading = true
            })
        }
    }
}

export default MapStore;
