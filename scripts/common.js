// создаем функцию, которая будет проверять значения в URL-адресе после регистрации
//пользователя - должно указываться имя, фамилия и электронная почта - эти данные
//будут использоваться во всех файлах после регистрации, поэтому функция вынесена в
//общий файл js

function checkUserData() {
    let url = new URL(location.href);
    const name = url.searchParams.get('name');
    const lastName = url.searchParams.get('lastName');
    const email = url.searchParams.get('email');

    if(!name || !lastName || !email) {
        location.href = 'index.html';
    }
}