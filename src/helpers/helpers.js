//create a uuidv4 to pass a uniqu ID to every post created by the user
export function createUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//generate OS specific map link form latitude and longitude
export function getGpsURL(latitude, longitude) {
    let scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    return scheme + `${latitude},${longitude}`;
}