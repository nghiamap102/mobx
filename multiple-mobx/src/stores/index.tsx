import { configure } from "mobx";
import React from "react";
import MapStore from "./mapStore";
export class RootStore {

    mapStore: MapStore
    constructor() {
        this.mapStore = new MapStore(this);

        configure({
            useProxies: "never",
            computedRequiresReaction: true
        })
    }

}

export const RootStoresContext = React.createContext(new RootStore());

