import './navbar.scss'
import { addElement } from '../../utils/add-element';
import {routes} from '../../engine/routes';
import setActiveLink from '../../utils/set-active-link';

const NavBar = () => {
  const nav = addElement('nav', 'navbar');
  for (let hash in routes) {
    if (hash === '404') continue;
    const linkItem = addElement('a', 'navbar-item')
    linkItem.setAttribute('href', `#${hash}`);
    const linkName = document.createTextNode(routes[hash][1]);
    linkItem.appendChild(linkName);
    nav.appendChild(linkItem);
    // linkItem.addEventListener('focus', () => linkItem.classList.add('active'));
    // linkItem.addEventListener('blur', () => linkItem.classList.remove('active'));
    linkItem.addEventListener('click', setActiveLink.bind('', hash));
  }

  return nav;
}

export default NavBar;
