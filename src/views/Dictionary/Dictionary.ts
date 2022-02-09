import './Dictionary.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { getWords, getWordById } from '../../components/api/api';
import { Word } from '../../interfaces';
import { wordCardRender } from './wordRender';
import chapterRender from './chapterRender';
import wordListRender from './wordListRender';
import Pagination from 'tui-pagination';
import { PaginationEvent } from '../../types';
import './tui-pagination.scss';

export let pagination: Pagination;

const paginationOptions = {
  totalItems: 30,
  itemsPerPage: 1,
  visiblePages: 5,
  page: 1,
  centerAlign: true,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  template: {
    page: '<button class="tui-page-btn">{{page}}</button>',
    currentPage: '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton:
      '<button class="tui-page-btn tui-{{type}}">' + '<span class="tui-ico-{{type}}">{{type}}</span>' + '</button>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</span>',
    moreButton:
      '<button class="tui-page-btn tui-{{type}}-is-ellip">' + '<span class="tui-ico-ellip">...</span>' + '</button>',
  },
};

async function paginationListener(event: PaginationEvent) {
  const currentPage = event.page - 1;

  const wordListWrapper = document.querySelector('.word-list-wrapper') as HTMLDivElement;
  const wordCardWrapper = document.querySelector('.word-card-wrapper') as HTMLDivElement;
  const chapterListElement = document.querySelector('.chapter-list') as HTMLUListElement;
  const chapterCheckedElement = chapterListElement.querySelector('input[type="radio"]:checked') as HTMLInputElement;

  const chapterId = (chapterCheckedElement.getAttribute('id') as string).slice(-1);
  const wordsArr = await getWords(`${currentPage}`, chapterId);

  wordListWrapper.innerHTML = '';
  wordListWrapper.append(wordListRender(wordsArr));

  wordCardWrapper.innerHTML = '';
  wordCardWrapper.append(wordCardRender(wordsArr[0]));
}

let wordsArr: Word[] = [];

export const getWordsFunc = async (page: string, chapter: string) => {
  wordsArr = await getWords(page, chapter);
};

export const Dictionary = async (): Promise<HTMLElement> => {
  await getWordsFunc('0', '0');
  const page = addElement('main', 'dictionary-page') as HTMLElement;
  const pageTitle = addTextElement('h1', 'page-title', 'Учебник') as HTMLHeadingElement;
  const wordsTitle = addTextElement('h2', 'words-title', 'Слова') as HTMLHeadingElement;
  const mainContentContainer = addElement('div', 'dictionary-words-container') as HTMLDivElement;
  const wordCardWrapper = addElement('div', 'word-card-wrapper') as HTMLDivElement;
  const wordListWrapper = addElement('div', 'word-list-wrapper') as HTMLDivElement;
  wordCardWrapper.append(wordCardRender(wordsArr[0]));
  const wordList = wordListRender(wordsArr);
  wordListWrapper.append(wordList);
  mainContentContainer.append(wordCardWrapper, wordListWrapper);

  const paginationElement = addElement('div', 'tui-pagination', 'pagination') as HTMLDivElement;

  page.append(pageTitle, chapterRender(), wordsTitle, mainContentContainer, paginationElement);

  pagination = new Pagination(paginationElement, paginationOptions);
  pagination.on('afterMove', async (event) => paginationListener(event));

  return page;
};

