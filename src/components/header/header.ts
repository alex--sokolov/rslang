import './header.scss';
import { addElement } from '../../utils/add-element';
import { NavBar } from '../navbar/navbar';
import { AuthPanel } from '../authorization/authorization';

const Header = () => {
  const element = addElement('header', 'header container');
  element.append(NavBar());
  element.append(AuthPanel());
  return element;
};

export default Header;
