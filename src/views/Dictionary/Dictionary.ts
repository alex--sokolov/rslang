import './Dictionary.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { getWords, getWordById } from '../../components/api/api';
import { Word } from '../../interfaces';

const chapterRender = (): HTMLDivElement => {
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

const wordCardRender = (word: Word): HTMLDivElement => {
  const wordCardContainer = addElement('div', 'word-card card') as HTMLDivElement;
  const cardImage = addElement('img', 'card__img') as HTMLImageElement;
  cardImage.src = `https://rs-lang-app-server.herokuapp.com/${word.image}`;
  cardImage.alt = 'Иллюстрация слова';
  const cardWord = addTextElement('h3', 'card__word', `${word.word}`) as HTMLHeadingElement;
  const cardTranscription = addTextElement('span', 'card__transcription', `${word.transcription}`) as HTMLSpanElement;
  const cardVoiceBtn = addElement('button', 'card__voice-btn') as HTMLButtonElement;
  const cardTranslate = addTextElement('h4', 'card__translate', `${word.wordTranslate}`) as HTMLParagraphElement;
  const cardSubheading = addTextElement('h5', 'card__subheading', 'Значение') as HTMLHeadingElement;
  const cardTextMeaning = addTextElement('p', 'card__text', `${word.textMeaning}`) as HTMLParagraphElement;
  const cardTextMeaningTranslate = addTextElement(
    'p',
    'card__text',
    `${word.textMeaningTranslate}`
  ) as HTMLParagraphElement;
  const cardSubheading2 = addTextElement('h5', 'card__subheading', 'Пример') as HTMLHeadingElement;
  const cardTextExample = addTextElement('p', 'card__text', `${word.textExample}`) as HTMLParagraphElement;
  const cardTextExampleTranslate = addTextElement(
    'p',
    'card__text',
    `${word.textExampleTranslate}`
  ) as HTMLParagraphElement;

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

  // const wordHeading = document.querySelector('.word-title') as HTMLHeadingElement;
  // wordHeading.after(wordCardContainer);
  return wordCardContainer;
};

const wordListRender = async (page: string, chapter: string): Promise<HTMLDivElement> => {
  const words = await getWords(page, chapter);
  const wordListContainer = addElement('div', 'word-list') as HTMLDivElement;

  console.log(words);

  const activeWordIndex = 0;

  words.forEach((word, i) => {
    const wordButton = addElement('button', 'word-item') as HTMLButtonElement;
    if (i === 0) {
      wordButton.classList.add('word-item--active');
    }
    wordButton.setAttribute('data-word-id', word.id);
    const wordEng = document.createElement('h3') as HTMLHeadingElement;
    wordEng.textContent = word.word;
    const wordTranslate = document.createElement('p') as HTMLParagraphElement;
    wordTranslate.textContent = word.wordTranslate;

    wordButton.append(wordEng, wordTranslate);
    wordListContainer.append(wordButton);
  });

  const activeWordBtn = wordListContainer.querySelector('.word-item--active') as HTMLButtonElement;
  const activeWordId = activeWordBtn.getAttribute('data-word-id') as string;
  // setTimeout(() => console.log(wordCard), 1000);

  const wordCard = wordCardRender(words[0]);
  console.log(wordCard);

  // const activeWord = await getWordById(activeWordId);
  // wordCardParse(activeWord);


  wordListContainer.before(wordCard);

  return wordListContainer;
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

export const Dictionary = async (): Promise<HTMLElement> => {
  const page = addElement('main', 'dictionary-page') as HTMLElement;
  const pageTitle = addTextElement('h1', 'page-title', 'Учебник') as HTMLElement;
  const wordsTitle = addTextElement('h2', 'words-title', 'Слова') as HTMLElement;

  page.append(pageTitle, chapterRender(), wordsTitle, await wordListRender('0', '0'), dictionaryPagination());

  // const wordListElement = document.querySelector('.word-list') as HTMLUListElement;
  // wordListElement.before(await wordCardRender(words[0]))
  return page;
};
