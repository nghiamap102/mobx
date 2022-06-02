import { configure, makeAutoObservable } from "mobx";
import React from "react";
import AnimalStore from "./animalStore";
import noteStore from "./noteStore";
import userStore from "./userStore";
export class RootStore {
    
    userStore: userStore
    noteStore: noteStore
    animalStore: AnimalStore
    constructor() {
        this.userStore = new userStore(this);
        this.noteStore = new noteStore(this);
        this.animalStore = new AnimalStore('gary');
        makeAutoObservable(this)
        configure({
            useProxies: "never",
            computedRequiresReaction: true
        })
    }
    
}

export const StoresContext = React.createContext(new RootStore());

