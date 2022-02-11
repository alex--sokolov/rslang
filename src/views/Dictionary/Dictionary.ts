import './Dictionary.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import {
  getCurrentPage,
  getCurrentChapter,
  setCurrentPage,
  setCurrentChapter,
} from '../../utils/local-storage-helpers';
import { getWords, getWordById } from '../../components/api/api';
import { Word } from '../../interfaces';
import { wordCardRender } from './wordRender';
import chapterRender from './chapterRender';
import wordListRender from './wordListRender';
import Pagination from 'tui-pagination';
import { PaginationEvent } from '../../types';
import './tui-pagination.scss';

let wordsArr: Word[] = [];
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

  const chapterListElement = document.querySelector('.chapter-list') as HTMLUListElement;
  const chapterCheckedElement = chapterListElement.querySelector('input[type="radio"]:checked') as HTMLInputElement;

  const chapterId = (chapterCheckedElement.getAttribute('id') as string).slice(-1);
  wordsArr = await getWords(`${currentPage}`, chapterId);

  const wordsContainerElement = document.querySelector('.dictionary-words-container') as HTMLDivElement;

  wordsContainerElement.innerHTML = '';
  wordsContainerElement.append(wordCardRender(wordsArr[0]), wordListRender(wordsArr));

  setCurrentPage(`${currentPage}`);
  if (!getCurrentChapter()) setCurrentChapter('0');
}

export const getWordsFunc = async (page: string, chapter: string) => {
  wordsArr = await getWords(page, chapter);
};

const getPage = (): string => {
  if (getCurrentPage()) {
    paginationOptions.page = +getCurrentPage() + 1;
    return getCurrentPage();
  }
  return '0';
};

const getActiveChapter = () => {
  const currentChapter = getCurrentChapter();
  const targetRadioElement = document.getElementById(`chapter-${currentChapter}`) as HTMLInputElement;
  targetRadioElement.checked = true;
};

export const Dictionary = async (): Promise<HTMLElement> => {
  const page = addElement('main', 'dictionary-page container') as HTMLElement;
  const pageTitle = addTextElement('h1', 'page-title', 'Учебник') as HTMLHeadingElement;
  const wordsTitle = addTextElement('h2', 'words-title', 'Слова') as HTMLHeadingElement;
  const mainContentContainer = addElement('div', 'dictionary-words-container') as HTMLDivElement;
  const paginationElement = addElement('div', 'tui-pagination', 'pagination') as HTMLDivElement;

  page.append(pageTitle, chapterRender(), wordsTitle, mainContentContainer, paginationElement);

  const currentPage = getPage();
  const currentChapter = getCurrentChapter() ? getCurrentChapter() : '0';

  await getWordsFunc(currentPage, currentChapter);

  mainContentContainer.append(wordCardRender(wordsArr[0]));
  const wordList = wordListRender(wordsArr);
  mainContentContainer.append(wordList);

  pagination = new Pagination(paginationElement, paginationOptions);
  pagination.on('afterMove', async (event) => paginationListener(event));

  setTimeout(getActiveChapter, 0);
  return page;
};
