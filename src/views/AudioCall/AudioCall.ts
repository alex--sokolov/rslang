import './AudioCall.scss';
import { addElement, addTextElement } from '../../utils/add-element';

export const AudioCall = (): HTMLElement => {
  const page = addElement('main', 'audio-call-page') as HTMLElement;
  const pageTitle =  addTextElement('h1', 'page-title', 'Audio Call Page') as HTMLElement;
  page.append(pageTitle);
  return page;
}
