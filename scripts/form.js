// создаем закрытую область, чтобы пользователи не получили к ней доступ, весь код внутри
(function () {
//     создаем объект с функцией инициализации первичной страницы для пользователя
    const Form = {
        // создаем свойство для полей в виде массива с объектами для последующей валидации
        agreeElement: null,
        processElement: null,
        fields: [
            // создаем объекты полей, указываем id, чтобы точно привязать поля
            {
                name: "name",
                id: "name",
                element: null,
                regex: /^[А-Я][а-я]+\s*$/,
                valid: false,
            },
            {
                name: "lastName",
                id: "last-name",
                element: null,
                regex: /^[А-Я][а-я]+\s*$/,
                valid: false,
            },
            {
                name: "email",
                id: "email",
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            }
        ],
        init() {
            // делаем замыкание, чтобы можно было использовать контекст this - ссылку на объект
            // Form, даже если контекст был потерян
            const that = this;
            // проходимся по массиву и размещаем в свойства данные необходимого элемента
            this.fields.forEach(item => {
                item.element = document.getElementById(item.id);
                //вешаем обработчик событий
                item.element.onchange = function () {
                    // передаем полученные данные that и параметры функции: field - это текущий элемент
                    // item, по которому проходим, и ссылка на сам текущий элемент через контекст this
                    that.validateField.call(that, item, this);
                }
            });

            // ищем кнопку для снятия у нее блокировки и обработчик событий
            this.processElement = document.getElementById('process');
            this.processElement.onclick = function () {
                that.processForm();
            }

            // ищем чекбокс и вешаем обработчки событий
            this.agreeElement = document.getElementById('agree');
            this.agreeElement.onchange = function () {
                that.validateForm();
            }
        },
        //создаем функцию валидации, принимающую параметры поле и текущий элемент
        validateField(field, element) {
            if (!element.value || !element.value.match(field.regex)) {
                element.parentNode.style.borderColor = 'red';
                field.valid = false;
            } else {
                element.parentNode.removeAttribute('style');
                field.valid = true;
            }
            this.validateForm();
        },
        validateForm() {
            const validForm = this.fields.every(item => item.valid);
            const isValid = this.agreeElement.checked && validForm;
            if (isValid) {
                this.processElement.removeAttribute('disabled');
            } else {
                this.processElement.setAttribute('disabled', 'disabled');
            }
            return isValid;
        },
        //     создаем функцию для сбора информации о заполненных пользователях при нажатии на кнопку
        processForm() {
            if (this.validateForm()) {
                let paramString = '';
                this.fields.forEach(item => {
                    paramString += (!paramString ? '?' : '&') + item.name + '=' + item.element.value;
                })

                location.href = 'choice.html' + paramString;
            }
        }
    };
    // вызываем функцию инициализации страницы пользователя
    Form.init();


})();