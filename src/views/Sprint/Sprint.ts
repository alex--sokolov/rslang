import './Sprint.scss';
import { addElement, addTextElement } from '../../utils/add-element';

export const Sprint = async (params?: URLSearchParams): Promise <HTMLElement> => {
  console.log(params);
  console.log(params?.get('group'));
  console.log(params?.get('page'));
  console.log(params?.get('fromDictionary'));

  const render = async () => {
    const page = addElement('main', 'sprint-page') as HTMLElement;
    const pageTitle =  addTextElement('h1', 'page-title', 'Sprint Page') as HTMLElement;
    page.append(pageTitle);
    return page;
  }


  const listen = async () => {

  }

  const page = await render();
  await listen();
  return page;
}
