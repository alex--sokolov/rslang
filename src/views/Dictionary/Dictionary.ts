import './Dictionary.scss';
import { addElement, addTextElement } from '../../utils/add-element';

const chapterParse = (): HTMLDivElement => {
  const chapterList = addElement('div', 'chapter-list') as HTMLDivElement;

  for (let i = 0; i < 6; i++) {
    const chapterLabel = addElement('label', 'chapter-label') as HTMLLabelElement;
    chapterLabel.setAttribute('for', `group-${i}`);
    chapterLabel.textContent = `Часть ${i + 1}`;

    const chapterRadio = document.createElement('input');
    chapterRadio.type = 'radio';
    chapterRadio.name = 'chapter';
    chapterRadio.id = `group-${i}`;

    if (i === 0) {
      chapterRadio.checked = true;
    }

    const chapterWordsNums = addElement('p', 'chapter-words-nums') as HTMLSpanElement;
    chapterWordsNums.textContent = `${i * 600 + 1}-${(i + 1) * 600}`;

    chapterLabel.append(chapterWordsNums);
    chapterList.append(chapterRadio);
    chapterList.append(chapterLabel);
  }

  return chapterList;
};

const dictionaryPagination = (): HTMLUListElement => {
  const pagination = addElement('ul', 'dictionary-pagination pagination') as HTMLUListElement;

  for (let i = 0; i < 32; i++) {
    const liElement = document.createElement('li') as HTMLLIElement;
    const buttonElement = addElement('button', 'pagination__button') as HTMLButtonElement;

    if (i === 0) {
      buttonElement.innerHTML = '&lt;';
    } else if (i === 31) {
      buttonElement.innerHTML = '&gt;';
    } else {
      buttonElement.textContent = `${i}`;
    }

    liElement.append(buttonElement);
    pagination.append(liElement);
  }

  return pagination;
};

export const Dictionary = (): HTMLElement => {
  const page = addElement('main', 'dictionary-page') as HTMLElement;
  const pageTitle = addTextElement('h1', 'page-title', 'Учебник') as HTMLElement;
  const wordsTitle = addTextElement('h2', 'words-title', 'Слова') as HTMLElement;

  page.append(pageTitle);
  page.append(chapterParse());
  page.append(wordsTitle);
  page.append(dictionaryPagination());
  return page;
};
