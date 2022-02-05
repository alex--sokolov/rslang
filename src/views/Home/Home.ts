import './Home.scss';
import { addElement, addTextElement } from '../../utils/add-element';

export const Home = (): HTMLElement => {
  const home = addElement('main', 'home-page') as HTMLElement;
  const pageTitle = addTextElement('h1', 'page-title', 'Home Page') as HTMLElement;
  home.append(pageTitle);
  return home;
};
