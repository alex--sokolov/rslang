import './authorization.scss';
import { addElement } from '../../utils/add-element';

const authSingInHTML = `
  <h3 class="auth__title">Войдите в свой аккаунт!</h3>
  <label for="email">Ваш email:</label>
  <input type="email" name="email" id="email" placeholder="example@gmail.com">
  <label for="password">Пароль:</label>
  <input type="password" name="password" id="password">
  <input type="submit" data-mode="signin" value="Войти">
  <p>Нет аккаунта? Тогда <button id="auth-toggle-btn" class="auth__toggle">зарегистрируйся!</button></p>
  <button class="auth__close-btn"></button>
  <p id="auth__warn" class="auth__warn"></p>
`;
const authRegisterHTML = `
  <h3 class="auth__title">Создайте свой аккаунт!</h3>
  <label for="email">Ваш email:</label>
  <input type="email" name="email" id="email" placeholder="example@gmail.com">
  <label for="name">Ваше имя:</label>
  <input type="text" name="name" id="name" placeholder="Anna">
  <label for="password">Придумайте пароль:</label>
  <input type="password" name="password" id="password">
  <label for="password-2">Повторите пароль:</label>
  <input type="password" name="password-2" id="password-2">
  <input type="submit" data-mode="register" value="Зарегистрироваться">
  <p>Уже есть аккаунт? <button id="auth-toggle-btn" class="auth__toggle">Войти!</button></p>
  <button class="auth__close-btn"></button>
  <p id="auth__warn" class="auth__warn"></p>
`;

const Authorization = (type = 'signin') => {
  const element = addElement('form', 'auth-form auth') as HTMLFormElement;

  if (type === 'signin') {
    element.innerHTML = authSingInHTML;
  } else if (type === 'register') {
    element.innerHTML = authRegisterHTML;
  }

  return element;
};

export default Authorization;
