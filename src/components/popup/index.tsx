
interface PopupProps {
    name?: string;
    description?: string;
    changeName?: (e: any) => void;
    changeDescription?: (e: any) => void;
}

const Popup = ({
    changeDescription,
    changeName,
}: PopupProps) => (
    <div className="popup">
        <h3>Layers&apos;s Information</h3>
        <div className="">
            <input type="text" onChange={changeName} />
        </div>
        <div className="">
            <input type="text" onChange={changeDescription} />
        </div>
    </div>
)
export default Popup