import './Dictionary.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { getWords, getWordById } from '../../components/api/api';
import { Word } from '../../interfaces';
import { wordCardRender } from './wordRender';
import chapterRender from './chapterRender';
import dictionaryPagination from './pagination';
import wordListRender from './wordListRender';

let wordsArr: Word[] = [];

export const getWordsFunc = async (page: string, chapter: string) => {
  wordsArr = await getWords(page, chapter);
};

export const Dictionary = async (): Promise<HTMLElement> => {
  await getWordsFunc('0', '0');
  const page = addElement('main', 'dictionary-page') as HTMLElement;
  const pageTitle = addTextElement('h1', 'page-title', 'Учебник') as HTMLHeadingElement;
  const wordsTitle = addTextElement('h2', 'words-title', 'Слова') as HTMLHeadingElement;
  const wordCardWrapper = addElement('div', 'word-card-wrapper') as HTMLDivElement;
  const wordListWrapper = addElement('div', 'word-list-wrapper') as HTMLDivElement;
  wordCardWrapper.append(wordCardRender(wordsArr[0]));
  const wordList = wordListRender(wordsArr);
  wordListWrapper.append(wordList);

  page.append(pageTitle, chapterRender(), wordsTitle, wordCardWrapper, wordListWrapper, dictionaryPagination());

  return page;
};
