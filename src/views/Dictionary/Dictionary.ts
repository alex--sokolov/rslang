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

const wordCard = (): HTMLDivElement => {
  const wordCardContainer = addElement('div', 'word-card card') as HTMLDivElement;
  const cardImage = addElement('img', 'card__img') as HTMLImageElement;
  cardImage.src = '';
  cardImage.alt = 'Иллюстрация слова';
  const cardWord = addTextElement('h3', 'card__word', `word`) as HTMLHeadingElement;
  const cardTranscription = addTextElement('span', 'card__transcription', 'transcription') as HTMLSpanElement;
  const cardVoiceBtn = addElement('button', 'card__voice-btn') as HTMLButtonElement;
  const cardTranslate = addTextElement('h4', 'card__translate', 'translate') as HTMLParagraphElement;
  const cardSubheading = addTextElement('h5', 'card__subheading', 'Значение') as HTMLHeadingElement;
  const cardTextMeaning = addTextElement('p', 'card__text', 'textMeaning') as HTMLParagraphElement;
  const cardTextMeaningTranslate = addTextElement('p', 'card__text', 'textMeaningTranslate') as HTMLParagraphElement;
  const cardSubheading2 = addTextElement('h5', 'card__subheading', 'Пример') as HTMLHeadingElement;
  const cardTextExample = addTextElement('p', 'card__text', 'textExample') as HTMLParagraphElement;
  const cardTextExampleTranslate = addTextElement('p', 'card__text', 'textExampleTranslate') as HTMLParagraphElement;

  wordCardContainer.append(
    cardImage,
    cardWord,
    cardTranscription,
    cardVoiceBtn,
    cardTranslate,
    cardSubheading,
    cardTextMeaning,
    cardTextMeaningTranslate,
    cardSubheading2,
    cardTextExample,
    cardTextExampleTranslate
  );
  return wordCardContainer;
};

export const Dictionary = (): HTMLElement => {
  const page = addElement('main', 'dictionary-page') as HTMLElement;
  const pageTitle = addTextElement('h1', 'page-title', 'Учебник') as HTMLElement;
  const wordsTitle = addTextElement('h2', 'words-title', 'Слова') as HTMLElement;

  page.append(pageTitle, chapterParse(), wordsTitle, wordCard(), dictionaryPagination());
  return page;
};
