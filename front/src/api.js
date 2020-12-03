export default class API {
    constructor(url) {
        this.API_URL = url
    }
    obtenerFilms() {
        return fetch(this.API_URL + '/films')
            .then(response => response.json())
            .then(response => console.log(response))
    }

}