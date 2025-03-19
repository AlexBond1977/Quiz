import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Test {
    constructor() {
        this.progressBarElement = null; // Элемент прогресс-бара.
        this.passButtonElement = null; // Кнопка для завершения теста.
        this.prevButtonElement = null; // Кнопка "Назад".
        this.nextButtonElement = null; // Кнопка "Далее".
        this.questionTitleElement = null; // Элемент заголовка вопроса.
        this.optionsElement = null; // Элемент для отображения ответов.
        this.quiz = null; // Хранит данные о тесте.
        this.currentQuestionIndex = 1;
        this.userResult = []; // Хранит результаты пользователя.
        this.routeParams = UrlManager.getQueryParams();

        this.init();
    }

    //В методе проверяется наличие ID теста в параметрах URL и выполняется GET-запрос на сервер
    // для получения данных теста. Если запрос успешен, данные теста сохраняются и начинается тест.
    async init() {
        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id)

                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.quiz = result;
                    this.startQuiz();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    startQuiz() {
        this.progressBarElement = document.getElementById('progress-bar');
        this.questionTitleElement = document.getElementById('title');
        this.optionsElement = document.getElementById('options');
        this.nextButtonElement = document.getElementById('next');
        this.nextButtonElement.onclick = this.move.bind(this, 'next');
        this.passButtonElement = document.getElementById('pass');
        this.passButtonElement.onclick = this.move.bind(this, 'pass');
        this.prevButtonElement = document.getElementById('prev');
        this.prevButtonElement.onclick = this.move.bind(this, 'prev');
        document.getElementById('pre-title').innerText = this.quiz.name;

        this.prepareProgressBar();
        this.showQuestion();

        const timerElement = document.getElementById('timer')
        let seconds = 59;
        this.interval = setInterval(function () {
            seconds--;
            timerElement.innerText = seconds;
            if (seconds === 0) {
                clearInterval(this.interval);
                this.complete();
            }
        }.bind(this), 1000);
    }

    prepareProgressBar() {
        for (let i = 0; i < this.quiz.questions.length; i++) {
            const itemElement = document.createElement('div');
            itemElement.className = 'test-progress-bar-item ' + (i === 0 ? 'active' : '');

            const itemCircleElement = document.createElement('div');
            itemCircleElement.className = 'test-progress-bar-item-circle';

            const itemTextElement = document.createElement('div');
            itemTextElement.className = 'test-progress-bar-item-text';
            itemTextElement.innerText = 'Вопрос ' + (i + 1);

            itemElement.appendChild(itemCircleElement);
            itemElement.appendChild(itemTextElement);

            this.progressBarElement.appendChild(itemElement);
        }
    }

    showQuestion() {
        // Получаем вопрос по текущему индексу.
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
        // Отображение заголовка вопроса.
        this.questionTitleElement.innerHTML = '<span>Вопрос ' + this.currentQuestionIndex + ':</span> ' + activeQuestion.question;

        this.optionsElement.innerHTML = '';
        const that = this;
        const chosenOption = this.userResult.find(item => item.questionId === activeQuestion.id);
        activeQuestion.answers.forEach(answer => {
            const optionElement = document.createElement('div');
            optionElement.className = 'test-question-option';

            // Создаем уникальный ID для кнопки.
            const inputId = 'answer-' + answer.id;
            const inputElement = document.createElement('input');
            inputElement.className = 'option-answer';
            inputElement.setAttribute('id', inputId);
            inputElement.setAttribute('type', 'radio');
            inputElement.setAttribute('name', 'answer');
            inputElement.setAttribute('value', answer.id);
            if (chosenOption && chosenOption.chosenAnswerId === answer.id) {
                inputElement.setAttribute('checked', 'checked');
            }

            inputElement.onchange = function () {
                that.chooseAnswer();
            }

            const labelElement = document.createElement('label');
            labelElement.setAttribute('for', inputId);
            labelElement.innerText = answer.answer;

            optionElement.appendChild(inputElement);
            optionElement.appendChild(labelElement);

            this.optionsElement.appendChild(optionElement);
        });
        if (chosenOption && chosenOption.chosenAnswerId) {
            this.nextButtonElement.removeAttribute('disabled', 'disabled');
        } else {
            this.nextButtonElement.setAttribute('disabled', 'disabled');
        }
        if (this.currentQuestionIndex === this.quiz.questions.length) {
            this.nextButtonElement.innerText = 'Завершить';
        } else {
            this.nextButtonElement.innerText = 'Далее';
        }
        if (this.currentQuestionIndex > 1) {
            this.prevButtonElement.removeAttribute('disabled');
        } else {
            this.prevButtonElement.setAttribute('disabled', 'disabled');
        }
    }

    chooseAnswer() {
        this.nextButtonElement.removeAttribute('disabled');
    }

    move(action) {
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1]; // Текущий вопрос.
        // Находим выбранный ответ.
        const chosenAnswer = Array.from(document.getElementsByClassName('option-answer')).find(element => {
            return element.checked;
        });

        let chosenAnswerId = null;
        // Присваиваем выбранному ответу его ID.
        if (chosenAnswer && chosenAnswer.value) {
            chosenAnswerId = Number(chosenAnswer.value);
        }

        // Проверяем, выбирался ли ответ на текущий вопрос.
        const existingResult = this.userResult.find(item => {
            return item.questionId === activeQuestion.id;
        })
        if (existingResult) {
            existingResult.chosenAnswerId = chosenAnswerId;
        } else {
            this.userResult.push({
                questionId: activeQuestion.id,
                chosenAnswerId: chosenAnswerId,
            })
        }

        if (action === 'next' || action === 'pass') {
            this.currentQuestionIndex++;
        } else {
            this.currentQuestionIndex--;
        }

        if (this.currentQuestionIndex > this.quiz.questions.length) {
            clearInterval(this.interval);
            this.complete();
            return;
        }
        // Обновление прогресс-бара.
        Array.from(this.progressBarElement.children).forEach((item, index) => {
            const currentItemIndex = index + 1;
            item.classList.remove('complete');
            item.classList.remove('active');

            if (currentItemIndex === this.currentQuestionIndex) {
                item.classList.add('active');
            } else if (currentItemIndex < this.currentQuestionIndex) {
                item.classList.add('complete');
            }
        })

        this.showQuestion();
    }

    //Метод завершает тест, отправляет результаты на сервер и
    // перенаправляет пользователя на страницу с результатами.
    async complete() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }
        try {
            const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/pass', 'POST',
                {
                    userId: userInfo.userId,
                    results: this.userResult
                });

            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }
                location.href = '#/result?id=' + this.routeParams.id;
            }
        } catch (error) {
            console.log(error);
        }
    }
}