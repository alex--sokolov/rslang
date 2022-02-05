import './navbar.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { routes } from '../../engine/routes';
import setActiveLink from '../../utils/set-active-link';
import Authorization from '../authorization/authorization';
import { AuthParam, PostUser, SignInParam, Tokens } from '../../interfaces';
import { createUser, signIn } from '../api/api';
import { getToken, getUserName, setTokens, setUserId, setUserName } from '../../utils/local-storage-helpers';

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
    submitForm.removeEventListener('click', logIn);
    submitForm.addEventListener('click', registration);
  }
  if (submitForm.dataset.mode === 'signin') {
    submitForm.removeEventListener('click', registration);
    submitForm.addEventListener('click', logIn);
  }

  const authToggleBtn = document.getElementById('auth-toggle-btn') as HTMLButtonElement;
  authToggleBtn.addEventListener('click', openAuthModal);

  function logIn(event: Event): void {
    event.preventDefault();
    const inputEmail = document.getElementById('email') as HTMLInputElement;
    const inputPassword = document.getElementById('password') as HTMLInputElement;
    const formValues: SignInParam = {
      email: inputEmail.value,
      password: inputPassword.value,
    };
    signIn(formValues).then((response: Response) => {
      const status: number = response.status;
      const warn = document.getElementById('auth__warn') as HTMLParagraphElement;

      switch (status) {
        case 403:
          warn.classList.add('show');
          warn.innerText = 'Неверный пароль или email';
          break;
        case 404:
          warn.classList.add('show');
          warn.innerText = 'Пользователь не найден';
          break;
        case 200:
          warn.classList.remove('show');
          response.json().then((response: AuthParam) => {
            const form = document.querySelector('.auth-form') as HTMLFormElement;
            const headerButton = document.querySelector('.navbar-auth') as HTMLFormElement;
            const headerName = document.querySelector('.navbar .navbar-name') as HTMLSpanElement;
            const tokens: Tokens = {
              token: response.token,
              refreshToken: response.refreshToken,
            };

            setTokens(tokens);
            setUserId(response.userId);
            setUserName(response.name);
            form.remove();
            headerButton.innerText = 'Выйти';
            headerName.innerText = response.name;
            headerName.style.color = '';
            headerButton.removeEventListener('click', openAuthModal);
          });
          break;
        default:
          warn.classList.add('show');
          warn.innerText = 'Что-то пошло не так :(';
          break;
      }
    });
  }

  function registration(event: Event): void {
    event.preventDefault();
    const inputEmail = document.getElementById('email') as HTMLInputElement;
    const inputName = document.getElementById('name') as HTMLInputElement;
    const inputPassword = document.getElementById('password') as HTMLInputElement;
    const inputPassword_2 = document.getElementById('password-2') as HTMLInputElement;
    const warn = document.getElementById('auth__warn') as HTMLParagraphElement;
    const headerName = document.querySelector('.navbar .navbar-name') as HTMLSpanElement;
    const formValues: PostUser = {
      email: inputEmail.value,
      name: inputName.value,
      password: inputPassword.value,
    };

    if (inputPassword.value === inputPassword_2.value) {
      createUser(formValues).then((response: Response) => {
        const status: number = response.status;

        switch (status) {
          case 422:
            warn.classList.add('show');
            warn.innerText = 'Некорректный пароль или email';
            break;
          /*case 404:
            warn.classList.add('show');
            warn.innerText = 'Пользователь не найден';
            break;*/
          case 200:
            response.json().then((response: PostUser) => {
              const form = document.querySelector('.auth-form') as HTMLFormElement;
              form.remove();
              headerName.innerText = 'Пользователь создан!';
              headerName.style.color = 'green';
            });
            break;
          default:
            warn.classList.add('show');
            warn.innerText = 'Что-то пошло не так :(';
            break;
        }
      });
    } else {
      warn.innerText = 'Пароли не одинаковые';
      warn.classList.add('show');
    }

    console.log('registration...');
  }
}

const NavBar = () => {
  const nav = addElement('nav', 'navbar');

  for (let hash in routes) {
    if (hash === '404') continue;
    const linkItem = addElement('a', 'navbar-item');
    linkItem.setAttribute('href', `#${hash}`);
    const linkName = document.createTextNode(routes[hash][1]);
    linkItem.appendChild(linkName);
    nav.appendChild(linkItem);
    // linkItem.addEventListener('focus', () => linkItem.classList.add('active'));
    // linkItem.addEventListener('blur', () => linkItem.classList.remove('active'));
    linkItem.addEventListener('click', setActiveLink.bind('', hash));
  }

  const authUserName = addTextElement('span', 'navbar-name', getUserName());
  nav.appendChild(authUserName);
  const authLinkText = getToken('main') ? 'Выйти' : 'Войти';
  const authLink = addTextElement('button', 'navbar-auth', authLinkText);
  nav.appendChild(authLink);

  authLink.addEventListener('click', openAuthModal);
  return nav;
};

export default NavBar;
