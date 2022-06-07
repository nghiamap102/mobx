const getGeoLocation = (ele: any) => {
    return ele.geo.slice(ele.geo.indexOf("[") + 1, ele.geo.indexOf("]")).split(",")
}

const Helper = {
    getGeoLocation
}

export default Helper