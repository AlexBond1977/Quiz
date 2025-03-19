import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Result {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();

        this.init();
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }
        // Проверка наличия ID теста в URL.
        if (this.routeParams.id) {
            try {
                // Запрос к API для получения результатов теста.
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id +
                    '/result?userId=' + userInfo.userId);

                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    document.getElementById('result-score').innerText = result.score +
                        '/' + result.total; // Обновление поля результата.
                    this.addAnswersLink(); // Установка ссылки для перехода на страницу ответов.
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
        location.href = '#/';
    }

    addAnswersLink() {
        const answersLink = document.getElementById('answers-link');
        // Установка адреса для перехода на страницу ответов.
    answersLink.href = '#/answers?id=' + this.routeParams.id;
    }
}
