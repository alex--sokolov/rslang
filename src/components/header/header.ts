import './header.scss';
import { addElement } from '../../utils/add-element';
import { NavBar } from '../navbar/navbar';

const Header = () => {
  const element = addElement('header', 'header container');
  element.append(NavBar());
  return element;
};

export default Header;
