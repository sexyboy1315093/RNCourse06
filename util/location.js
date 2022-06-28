const GOOGLE_API_KEY = 'AIzaSyAVrycowsdaiue7dnqpxvayyjXeLVadxDI'

export function getMapPreview(lat, lng){
    const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap
    &markers=color:red%7Clabel:S%7C${lat},${lng}
    &key=${GOOGLE_API_KEY}`

    return imagePreviewUrl
}

export async function getAddress(lat, lng){
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    const response = await fetch(url)

    if(!response.ok){
        throw new Error('주소를 가져오지 못했습니다')
    }

    const data = await response.json()
    const address = data.results[0].formatted_address

    return address;
}