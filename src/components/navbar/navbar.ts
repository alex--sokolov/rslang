import './navbar.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { routes } from '../../engine/routes';
import setActiveLink from '../../utils/set-active-link';
import { openAuthModal } from '../authorization/authorization';
import { getToken, getUserId, getUserName } from '../../utils/local-storage-helpers';
import { signOut } from '../authorization/sign-out';

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
  const authLinkText = getToken() ? 'Выйти' : 'Войти';
  const authLink = addTextElement('button', 'navbar-auth', authLinkText);
  nav.appendChild(authLink);

  authLink.removeEventListener('click', getUserId() ? openAuthModal : signOut);
  authLink.addEventListener('click', getUserId() ? signOut : openAuthModal);
  return nav;
};

export { NavBar };
