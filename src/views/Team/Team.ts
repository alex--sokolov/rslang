import './Team.scss';
import { addElement, addTextElement } from '../../utils/add-element';

export const Team = (): HTMLElement => {
  const page = addElement('main', 'team-page') as HTMLElement;
  const pageTitle =  addTextElement('h1', 'page-title', 'Team Page') as HTMLElement;
  page.append(pageTitle);
  return page;
}
