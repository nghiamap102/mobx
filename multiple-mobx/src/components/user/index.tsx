import { autorun, trace } from "mobx";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { RootStoresContext } from '../../stores';

const UserCPN = () => {
    // let message = { author: 'abc', age: 10 }

    // const twitterUrls = observable.object({
    //     Joe: "twitter.com/joey"
    // })

    // autorun(() => {
    //     console.log(get(twitterUrls, "Sara")) // `get` can track not yet existing properties.
    // })
    // //first
    // runInAction(() => {
    //     set(twitterUrls, { Sara: "twitter.com/horsejs" })
    // })

    autorun((ele) => {
        trace() 
        console.log(ele)
    })
 
    const useStores = () => useContext(RootStoresContext);
    const { noteStore, userStore } = useStores();

    const handleNameChange = (e: any) => {
        e.preventDefault();
        const { value } = e.target;

        userStore.setUserName(value);
    };

    return <>
        <h1>hello {userStore.name}</h1>
        <h2>Change your name here</h2>
        <input type="text" value={userStore.name} onChange={handleNameChange} />
    </>
};

export default observer(UserCPN);