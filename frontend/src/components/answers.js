import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Answers {

    backButton = null; //Кнопка возврата на страницу с результатами теста.
    test = null; //Переменная для хранения данных о тесте, включая вопросы и ответы.

    constructor() {
        this.routeParams = UrlManager.getQueryParams(); // Получение параметров URL.
        this.userInfo = Auth.getUserInfo(); //Получение информации о пользователе.

        this.init();
    }

    //Метод проверяет аутентификацию пользователя. Если ID теста имеется, выполняется запрос на получение
    //деталей теста и ответов.
    async init() {
        if (!this.userInfo) {
            location.href = '#/';
        }
        if (this.routeParams.id) {
            try {
                const quizResult = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + this.userInfo.userId);
                this.test = quizResult.test;
                if (this.test) {
                    if (this.test.error) {
                        throw new Error(this.test.error);
                    }
                    this.showTitle(); // Отображение заголовка теста.
                    this.showUserInfo(); // Отображение информации о пользователе.
                    this.showAnswers(); // Отображение правильных ответов.
                    this.addBackLink(); // Установка ссылки возврата.
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    //Отображение заголовка.
    showTitle() {
        document.getElementById('answers-title').innerText = this.test.name;
    }

    //Отображение информации о пользователе.
    showUserInfo() {
        const userEmail = localStorage.getItem('activeEmail');//Email сохраняется в localStorage
        const userText = this.userInfo.fullName + ', ' + userEmail; //Формирование строки с полным именем пользователя.
        const answersUser = document.getElementById('answers-user'); //Отображение информации пользователя.
        answersUser.innerHTML = 'Тест выполнил: <span>' + userText + '</span>';
    }


    showAnswers() {
        this.backButton = document.getElementById('back'); //Возврат на результаты.
        this.answersList = document.getElementById('answers-list'); //Отображение вопросов.
        this.loadQuestions();
    }

    //Метод создания DOM-элементы для вопроса и его вариантов ответов, добавляет классы для
    // стилизации правильных и неправильных ответов.
    loadQuestions() {
        this.answersList.innerHTML = '';
        const questions = this.test.questions;

        questions.forEach((item, index) => {
            const answersListItem = document.createElement('div');
            answersListItem.className = 'answers-list-item';

            const questionTitle = document.createElement('div');
            questionTitle.className = 'answers-question-title';
            questionTitle.innerHTML = `<span>Вопрос ${index + 1}:</span> ${item.question}`;

            const questionOptions = document.createElement('div');
            questionOptions.className = 'answers-question-options';

            item.answers.forEach((answer, index) => {

                const inputId = `answers-question-option-${answer.id}`;
                const inputElement = document.createElement('input');
                inputElement.className = 'option-answer';

                inputElement.setAttribute('id', inputId);
                inputElement.setAttribute('type', 'radio');
                inputElement.setAttribute('name', `answers-question-${index}`);
                inputElement.setAttribute('value', answer.id);
                inputElement.setAttribute('disabled', 'disabled');

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', inputId);
                labelElement.innerText = answer.answer;

                const answerOption = document.createElement('div');
                answerOption.className = 'answers-question-option';
                answerOption.appendChild(inputElement);
                answerOption.appendChild(labelElement);

                if (answer.correct === true) {
                    answerOption.classList.add('correct');
                } else if (answer.correct === false) {
                    answerOption.classList.add('wrong');
                }

                questionOptions.appendChild(answerOption);
            });

            answersListItem.appendChild(questionTitle);
            answersListItem.appendChild(questionOptions);
            this.answersList.appendChild(answersListItem);
        });
    }

    addBackLink() {
        const answersLink = document.getElementById('back');
        answersLink.href = '#/result?id=' + this.routeParams.id;
    }
}
