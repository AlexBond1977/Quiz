import {UrlManager} from "../utils/url-manager.js";

export class Result {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();

        document.getElementById('result-score').innerText = this.routeParams.score + '/' +
            this.routeParams.total;
    }
}
