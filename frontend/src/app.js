import {Router} from "./router.js";

//Основная сущность приложения, содержит логику для инициализации маршрутизации.
class App {
    constructor() {
        this.router = new Router();
        //Этот обработчик срабатывает, когда весь HTML-документ загружен и обработан.
        // В этот момент вызывается метод `handleRouteChanging`, который отвечает за открытие соответствующего
        // маршрута. Привязка контекста `this` позволяет использовать текущий экземпляр `App` в методе.
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        //Это событие вызывается при навигации назад или вперед в истории браузера. При срабатывании этого
        // события также вызывается метод `handleRouteChanging`, что обеспечивает обновление контента в
        // зависимости от текущего URL.
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }

    //Метод вызывает метод `openRoute`, который отвечает за определение текущего маршрута и загрузку
    // соответствующего контента и стилей. Это основной метод, который инициирует процесс
    // маршрутизации при загрузке страницы или изменении состояния истории браузера.
    handleRouteChanging() {
        this.router.openRoute();
    }
}

(new App());