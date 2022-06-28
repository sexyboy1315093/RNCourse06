export class Place {
    constructor(title, imageUrl, location, id){
        this.title = title
        this.imageUrl = imageUrl
        this.address = location.address
        this.location = {lat: location.lat, lng: location.lng}
        this.id = id
    }
}
