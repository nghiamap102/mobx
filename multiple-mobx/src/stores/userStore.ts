// src/stores/user.store.js

import { get, makeAutoObservable } from "mobx";
import { RootStore } from ".";

class userStore {
    name = "Example-React";
    rootStore : RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setUserName = (name: string) => {
        this.name = name;
    };
    
    get getUsername(){
        return this.name
    } 
}

export default userStore;
