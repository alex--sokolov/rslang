import './Dictionary.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { getUserId, getPage, getChapter, setPage, setChapter } from '../../utils/local-storage-helpers';
import { getWords, getWordById, getUserAggregatedWords } from '../../components/api/api';
import { aggregatedWordsResponse, Word, WordExtended } from '../../interfaces';
import { wordCardRender } from './wordRender';
import chapterRender from './chapterRender';
import wordListRender from './wordListRender';
import Pagination from 'tui-pagination';
import { PaginationEvent } from '../../types';
import './tui-pagination.scss';

let wordsArr: WordExtended[] = [];
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

const getCurrPage = (): string => {
  if (getPage()) {
    paginationOptions.page = +getPage() + 1;
    return getPage();
  }
  return '0';
};

const getActiveChapter = () => {
  const currentChapter = getChapter();
  const targetRadioElement = document.getElementById(`chapter-${currentChapter}`) as HTMLInputElement;
  targetRadioElement.checked = true;
};

export const getWordsFunc = async (chapter: string, page: string) => {
  if (getUserId()) {
    const aggregatedWords = (await getUserAggregatedWords(getUserId(), chapter, page, '20')) as aggregatedWordsResponse;
    return (wordsArr = aggregatedWords.wordsList);
  } else {
    return (wordsArr = await getWords(chapter, page));
  }
};

async function paginationListener(event: PaginationEvent) {
  const currentPage = event.page - 1;

  const chapterListElement = document.querySelector('.chapter-list') as HTMLUListElement;
  const chapterCheckedElement = chapterListElement.querySelector('input[type="radio"]:checked') as HTMLInputElement;

  const chapterId = (chapterCheckedElement.getAttribute('id') as string).slice(-1);
  wordsArr = await getWordsFunc(chapterId, `${currentPage}`);

  const wordsContainerElement = document.querySelector('.dictionary-words-container') as HTMLDivElement;

  wordsContainerElement.innerHTML = '';
  wordsContainerElement.append(wordCardRender(wordsArr[0]), wordListRender(wordsArr));

  setPage(`${currentPage}`);
  if (!getChapter()) setChapter('0');
}

export const Dictionary = async (): Promise<HTMLElement> => {
  const page = addElement('main', 'dictionary-page container') as HTMLElement;
  const pageTitle = addTextElement('h1', 'page-title', 'Учебник') as HTMLHeadingElement;
  const wordsTitle = addTextElement('h2', 'words-title', 'Слова') as HTMLHeadingElement;
  const mainContentContainer = addElement('div', 'dictionary-words-container') as HTMLDivElement;
  const paginationElement = addElement('div', 'tui-pagination', 'pagination') as HTMLDivElement;

  page.append(pageTitle, chapterRender(), wordsTitle, mainContentContainer, paginationElement);

  const currentPage = getCurrPage();
  const currentChapter = getChapter() ? getChapter() : '0';

  await getWordsFunc(currentChapter, currentPage);

  mainContentContainer.append(wordCardRender(wordsArr[0]));
  const wordList = wordListRender(wordsArr);
  mainContentContainer.append(wordList);

  pagination = new Pagination(paginationElement, paginationOptions);
  pagination.on('afterMove', async (event) => paginationListener(event));

  setTimeout(getActiveChapter, 0);
  return page;
};
