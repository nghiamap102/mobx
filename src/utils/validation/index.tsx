const geocoder = /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
const checkEmpty = (ele : any) => {
    if(ele){
        return ele
    }else{
        return undefined
    }
}

const Validation = {
    geocoder,
    checkEmpty
}

export default Validation;