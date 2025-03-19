import config from "../../config/config.js";

//Эти ключи используются для хранения токенов и информации о пользователе в локальном
// хранилище localStorage.
export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';
    static userEmailKey = 'userEmail';

    //Метод обрабатывает случай, когда токен доступа недействителен.
    static async processUnauthorizedRequest() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.setTokens(result.accessToken, result.refreshToken);
                    return true;
                }
            }
        }

        this.removeTokens();
        location.href = '#/';
        return false;
    }

    //Метод для выхода из системы.
    static async logout() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    Auth.removeTokens();
                    localStorage.removeItem(Auth.userInfoKey);
                    return true;
                }
            }
        }
    }

    //Сохраняет токены в локальном хранилище.
    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    //Удаляет токены из локального хранилища.
    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    //Сохраняет информацию о пользователе.
    static setUserInfo(info) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    //Сохраняет email пользователя.
    static setUserEmail(email) {
        localStorage.setItem(this.userEmailKey, email);
    }

//Получает email пользователя из локального хранилища.
    static getUserEmail() {
        const userEmail = localStorage.getItem(this.userEmailKey);
        if (userEmail) {
            return userEmail;
        }
        return null;
    }

    //Получает и парсит информацию о пользователе из локального хранилища.
    static getUserInfo() {
        const userInfo = localStorage.getItem(this.userInfoKey)
        if (userInfo) {
            return JSON.parse(userInfo);
        }
        return null;
    }
}