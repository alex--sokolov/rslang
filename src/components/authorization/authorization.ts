import './authorization.scss';
import { addElement } from '../../utils/add-element';
import { signIn } from './sign-in';
import { registration } from './registration';
import { signOut } from './sign-out';

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

function openAuthModal() {
  const root = document.getElementById('root') as HTMLDivElement;

  if (!document.querySelector('.auth-form')) {
    root.append(Authorization('signin'));
    const authForm = document.querySelector('.auth-form') as HTMLFormElement;
    authForm.setAttribute('data-type', 'signin');
  } else {
    const authForm = document.querySelector('.auth-form') as HTMLFormElement;
    const authFormType = authForm.getAttribute('data-type');

    if (authFormType === 'signin') {
      authForm.remove();
      root?.append(Authorization('register'));
      document.querySelector('.auth-form')?.setAttribute('data-type', 'register');
    } else if (authFormType === 'register') {
      authForm.remove();
      root?.append(Authorization('signin'));
      document.querySelector('.auth-form')?.setAttribute('data-type', 'signin');
    }
  }

  const submitForm = document.querySelector('.auth-form [type="submit"]') as HTMLInputElement;
  if (submitForm.dataset.mode === 'register') {
    submitForm.removeEventListener('click', signIn);
    submitForm.addEventListener('click', registration);
  }
  if (submitForm.dataset.mode === 'signin') {
    submitForm.removeEventListener('click', registration);
    submitForm.addEventListener('click', signIn);
  }

  const authToggleBtn = document.getElementById('auth-toggle-btn') as HTMLButtonElement;
  authToggleBtn.removeEventListener('click', signOut);
  authToggleBtn.addEventListener('click', openAuthModal);
}

export { Authorization, openAuthModal };
