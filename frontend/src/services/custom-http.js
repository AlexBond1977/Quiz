import {Auth} from "./auth.js";

//Метод статический и отвечает за выполнение HTTP-запросов: url - URL, к которому будет выполняться
// запрос; method - HTTP-метод (по умолчанию "GET"); body - данные, отправляемые с запросом.
export class CustomHttp {
    static async request(url, method = "GET", body = null) {

        //Объект, который содержит настройки запроса, включая метод и заголовки.
        const params = {
            method: method,
            headers: {
                'Content-Type': 'application/json', //Тип контента, который отправляется.
                'Accept': 'application/json' //Тип контента, который ожидается в ответе.
            }
        };

        let token = localStorage.getItem(Auth.accessTokenKey);
        if (token) {
            params.headers['x-access-token'] = token;
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        const response = await fetch(url, params);

        if (response.status < 200 || response.status >= 300) {
            if (response.status === 401) {
                const result = await Auth.processUnauthorizedRequest();
                if (result) {
                    return await this.request(url, method, body);
                } else {
                    return null;
                }
            }
            throw new Error(response.message);
        }

        return await response.json();
    }
}