const express = require('express');
const cors = require('cors');
const testRoutes = require('./routes/test.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", authRoutes); //авторизационный роутинг
app.use("/api/tests", testRoutes); //роутинг для получения, добавления, редактирования тестов

app.listen('3000', () =>
    console.log(`Server started`)
)