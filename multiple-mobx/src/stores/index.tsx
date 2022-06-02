import React from "react";
import noteStore from "./noteStore";
import userStore from "./userStore";

export class RootStore {

    userStore: userStore
    noteStore: noteStore

    constructor() {
        this.userStore = new userStore(this);
        this.noteStore = new noteStore(this);
    }
}

export const StoresContext = React.createContext(new RootStore());

