import './Sprint.scss';
import { addElement, addTextElement } from '../../utils/add-element';

export const Sprint = (): HTMLElement => {
  const page = addElement('main', 'sprint-page') as HTMLElement;
  const pageTitle =  addTextElement('h1', 'page-title', 'Sprint Page') as HTMLElement;
  page.append(pageTitle);
  return page;
}
