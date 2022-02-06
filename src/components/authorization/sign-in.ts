import { AuthParam, SignInParam, Tokens } from '../../interfaces';
import { signInApi } from '../api/api';
import { setTokens, setUserId, setUserName } from '../../utils/local-storage-helpers';
import { signOut } from './sign-out';
import { openAuthModal } from './authorization';

function signIn(event: Event): void {
  event.preventDefault();
  const inputEmail = document.getElementById('email') as HTMLInputElement;
  const inputPassword = document.getElementById('password') as HTMLInputElement;
  const formValues: SignInParam = {
    email: inputEmail.value,
    password: inputPassword.value,
  };
  signInApi(formValues).then((response: Response) => {
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
          headerButton.addEventListener('click', signOut);
        });
        break;
      default:
        warn.classList.add('show');
        warn.innerText = 'Что-то пошло не так :(';
        break;
    }
  });
}

export { signIn };
