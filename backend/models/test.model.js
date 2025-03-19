//метод для работы с базой данных, генерирующая данные только во время работы приложения,
//все новые пользователи добавляются в базу данных, но не в файл
const TAFFY = require('taffy');
const tests = TAFFY(require('../data/tests.json'));

class TestModel {
    static async findAll() {
        return tests().get();
    }

    static async findOne(id) {
        return tests({id: parseInt(id)}).first();
    }
}

module.exports = TestModel;