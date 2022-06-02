import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { StoresContext } from '../../stores';

type Props = {

};
const UserCpn = () => {
    const useStores = () => useContext(StoresContext);
    const { noteStore, userStore } = useStores();

    const handleNameChange = (e: any) => {
        e.preventDefault();
        const { value } = e.target;

        // access the user store set name action
        userStore.setUserName(value);
    };

    return <>
        <h1>hello {userStore.name}</h1>

        <h2>Change your name here</h2>
        <input type="text" value={userStore.name} onChange={handleNameChange} />
    </>
};

export default observer(UserCpn);