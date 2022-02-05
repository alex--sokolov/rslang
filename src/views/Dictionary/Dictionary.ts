import './Dictionary.scss';
import { addElement, addTextElement } from '../../utils/add-element';

export const Dictionary = (): HTMLElement => {
  const page = addElement('main', 'dictionary-page') as HTMLElement;
  const pageTitle =  addTextElement('h1', 'page-title', 'Dictionary Page') as HTMLElement;
  page.append(pageTitle);
  return page;
}
