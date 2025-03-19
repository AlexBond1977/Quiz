import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Choice {
    constructor() {
        this.quizzes = []; // Массив для хранения доступных тестов.
        this.testResult = null; // Хранит результаты тестов пользователя.
        this.routeParams = UrlManager.getQueryParams(); // Получаем параметры из URL.

        this.init();
    }

    //Метод выполняет запрос к бэкенду для получения списка доступных тестов и результатов тестов
    // пользователя, если он авторизован.
    async init() {
        try {
            const result = await CustomHttp.request(config.host + '/tests'); // Получение всех тестов.

            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }
                this.quizzes = result;  // Сохраняем тесты в классе.
            }
        } catch (error) {
            return console.log(error);
        }

        const userInfo = Auth.getUserInfo(); // Получение информации о пользователе.
        if (userInfo) {
            try {
                // Получение результатов тестов для текущего пользователя.
                const result = await CustomHttp.request(config.host + '/tests/results?userId=' + userInfo.userId);

                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.testResult = result;
                }
            } catch (error) {
                return console.log(error); // Сохраняем результаты тестов.
            }
        }
        this.processQuizzes(); // Обработка полученных тестов
    }

    //Метод создания элементов для каждого теста на странице, добавления информацию о результатах
    // пользователя и включения обработчика клика для перехода к выбранному тесту.
    processQuizzes() {
        const choiceOptionsElement = document.getElementById('choice-options');
        if (this.quizzes && this.quizzes.length > 0) {
            this.quizzes.forEach(quiz => {
                const that = this;
                const choiceOptionElement = document.createElement('div');
                choiceOptionElement.className = 'choice-option';
                choiceOptionElement.setAttribute('data-id', quiz.id);
                choiceOptionElement.onclick = function () {
                    that.chooseQuiz(this);
                }

                const choiceOptionTextElement = document.createElement('div');
                choiceOptionTextElement.className = 'choice-option-text';
                choiceOptionTextElement.innerText = quiz.name;

                const choiceOptionArrowElement = document.createElement('div');
                choiceOptionArrowElement.className = 'choice-option-arrow';

                const result = this.testResult ? this.testResult.find(item => item.testId === quiz.id) : null;
                if (result) {
                    const choiceOptionResultElement = document.createElement('div');
                    choiceOptionResultElement.className = 'choice-option-result';
                    choiceOptionResultElement.innerHTML = '<div>Результат</div><div>' + result.score + '/' + result.total + '</div>';
                    choiceOptionElement.appendChild(choiceOptionResultElement);
                }

                const choiceOptionImageElement = document.createElement('img');
                choiceOptionImageElement.setAttribute('src', '/images/arrow.png');
                choiceOptionImageElement.setAttribute('alt', 'Стрелка');

                choiceOptionArrowElement.appendChild(choiceOptionImageElement);
                choiceOptionElement.appendChild(choiceOptionTextElement);
                choiceOptionElement.appendChild(choiceOptionArrowElement);

                choiceOptionsElement.appendChild(choiceOptionElement);
            });
        }
    }

//Метод обработки клика, если ID теста существует, пользователь перенаправляется на страницу теста.
    chooseQuiz(element) {
        const dataId = element.getAttribute('data-id');
        if (dataId) {
            location.href = '#/test?id=' + dataId;
        }
    }
}