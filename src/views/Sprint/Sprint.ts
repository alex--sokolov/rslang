import './Sprint.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { getUserAggregatedWords } from '../../components/api/api';

export const Sprint = async (params?: URLSearchParams): Promise <HTMLElement> => {
  console.log(params);
  console.log(params?.get('group'));
  console.log(params?.get('page'));
  console.log(params?.get('fromDictionary'));

  const render = async () => {
    const page = addElement('main', 'sprint-page') as HTMLElement;
    const pageTitle =  addTextElement('h1', 'page-title', 'Sprint Page') as HTMLElement;
    page.append(pageTitle);

    const { wordsList, totalWords } = await getUserAggregatedWords('6200fc9bf7ac1400169f2d52', '1', '25','','{"userWord.difficulty":"easy"}');
    console.log(wordsList);
    console.log(totalWords);

    return page;
  }


  const listen = async () => {

  }

  const page = await render();
  await listen();
  return page;
}
