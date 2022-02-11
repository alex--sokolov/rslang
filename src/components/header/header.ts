import './header.scss';
import { addElement } from '../../utils/add-element';
import { NavBar } from '../navbar/navbar';
import { AuthPanel } from '../authorization/authorization';

const Header = () => {
  const element = addElement('header', 'header');
  const container = addElement('div', 'container') as HTMLDivElement;
  container.append(NavBar(), AuthPanel());
  element.append(container);
  return element;
};

export default Header;
