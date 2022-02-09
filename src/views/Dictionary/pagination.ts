// old pagination, we'll delete it later

import { addElement } from '../../utils/add-element';
import { getWords } from '../../components/api/api';
import wordListRender from './wordListRender';
import { wordCardRender } from './wordRender';

async function pageListener(i: number) {
  const wordListWrapper = document.querySelector('.word-list-wrapper') as HTMLDivElement;
  const wordCardWrapper = document.querySelector('.word-card-wrapper') as HTMLDivElement;
  const chapterListElement = document.querySelector('.chapter-list') as HTMLUListElement;
  const chapterCheckedElement = chapterListElement.querySelector('input[type="radio"]:checked') as HTMLInputElement;

  const chapterId = (chapterCheckedElement.getAttribute('id') as string).slice(-1);
  const wordsArr = await getWords(`${i}`, chapterId);

  wordListWrapper.innerHTML = '';
  wordListWrapper.append(wordListRender(wordsArr));

  wordCardWrapper.innerHTML = '';
  wordCardWrapper.append(wordCardRender(wordsArr[0]));
}

const paginationRender = (): HTMLUListElement => {
  const pagination = addElement('ul', 'pagination') as HTMLUListElement;

  for (let i = 0; i < 32; i++) {
    const liElement = document.createElement('li') as HTMLLIElement;
    const buttonElement = addElement('button', 'page__btn') as HTMLButtonElement;
    buttonElement.setAttribute('data-page', `${i - 1}`);

    if (i === 0) {
      buttonElement.innerHTML = '&lt;';
    } else if (i === 31) {
      buttonElement.innerHTML = '&gt;';
    } else {
      buttonElement.textContent = `${i}`;
    }

    if (i === 1) {
      buttonElement.classList.add('page__btn_active');
    }

    liElement.append(buttonElement);
    pagination.append(liElement);

    if (i === 0) {
      buttonElement.addEventListener('click', () => {
        const lastActivePageElement = document.querySelector('.page__btn_active') as HTMLButtonElement;
        lastActivePageElement?.classList.remove('page__btn_active');
        lastActivePageElement.parentElement?.previousElementSibling?.firstElementChild?.classList.add('page__btn_active');
        const pageNum = lastActivePageElement.getAttribute('data-page') as string;
        pageListener(+pageNum - 1);
      });

    } else if (i === 31) {
      buttonElement.addEventListener('click', () => {
        const lastActivePageElement = document.querySelector('.page__btn_active') as HTMLButtonElement;
        lastActivePageElement?.classList.remove('page__btn_active');
        lastActivePageElement.parentElement?.nextElementSibling?.firstElementChild?.classList.add('page__btn_active');
        const pageNum = lastActivePageElement.getAttribute('data-page') as string;
        pageListener(+pageNum + 1);
      });

    } else {
      buttonElement.addEventListener('click', () => {
        const lastActivePageElement = document.querySelector('.page__btn_active') as HTMLButtonElement;
        lastActivePageElement?.classList.remove('page__btn_active');
        buttonElement.classList.add('page__btn_active');
        pageListener(i - 1);
      });
    }
  }

  return pagination;
};

export default paginationRender;
