import './navbar.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { routes } from '../../engine/routes';
import setActiveLink from '../../utils/set-active-link';
import Authorization from '../authorization/authorization';
import { getToken, getUserName } from '../../utils/local-storage-helpers';
import { signIn } from '../authorization/sign-in';
import { registration } from '../authorization/registration';

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
  authToggleBtn.addEventListener('click', openAuthModal);
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

export { NavBar, openAuthModal };
