import { addElement, addTextElement } from '../../utils/add-element';
import { Word } from '../../interfaces';
import { getUserId } from '../../utils/local-storage-helpers';

export const wordCardRender = (word: Word): HTMLDivElement => {
  const wordCardContainer = addElement('div', 'word-card card') as HTMLDivElement;
  const wordCardLeftSide = addElement('div', 'card__left-side') as HTMLDivElement;
  const wordCardRightSide = addElement('div', 'card__right-side') as HTMLDivElement;
  const btnsContainer = addElement('div', 'card__btns-container') as HTMLDivElement;

  const image =`<img src="https://rs-lang-app-server.herokuapp.com/${word.image}" class="card__img" alt="Иллюстрация слова">`;
  const wordEng = addTextElement('h3', 'card__word', `${word.word} - `) as HTMLHeadingElement;
  const transcription = addTextElement('span', 'card__transcription', `${word.transcription}`) as HTMLSpanElement;
  const translate = addTextElement('h4', 'card__translate', `${word.wordTranslate}`) as HTMLParagraphElement;
  const subheading = addTextElement('h5', 'card__subheading', 'Значение') as HTMLHeadingElement;
  const textMeaning = addElement('p', 'card__text') as HTMLParagraphElement;
  textMeaning.insertAdjacentHTML('beforeend', word.textMeaning);
  const textMeaningTranslate = addTextElement(
    'p',
    'card__text',
    `${word.textMeaningTranslate}`
  ) as HTMLParagraphElement;
  const subheading2 = addTextElement('h5', 'card__subheading', 'Пример') as HTMLHeadingElement;
  const textExample = addElement('p', 'card__text') as HTMLParagraphElement;
  textExample.insertAdjacentHTML('beforeend', word.textExample);
  const textExampleTranslate = addTextElement(
    'p',
    'card__text',
    `${word.textExampleTranslate}`
  ) as HTMLParagraphElement;
  const voiceBtn = addElement('button', 'card__voice-btn') as HTMLButtonElement;

  const wordCheckboxes = `
    <input type="checkbox" name="hard-word" id="hard-word-checkbox" class="card__checkbox">
    <label for="hard-word-checkbox" class="card__label">Сложное</label>
    <input type="checkbox" name="learned-word" id="learned-word-checkbox" class="card__checkbox">
    <label for="learned-word-checkbox" class="card__label">Изученное</label>
  `;

  wordCardRightSide.append(
    wordEng,
    transcription,
    translate,
    subheading,
    textMeaning,
    textMeaningTranslate,
    subheading2,
    textExample,
    textExampleTranslate,
    btnsContainer
  );

  wordCardLeftSide.insertAdjacentHTML('afterbegin', image);
  btnsContainer.append(voiceBtn);
  // if (getUserId()) // TODO: Turn on
  btnsContainer.insertAdjacentHTML('beforeend', wordCheckboxes);

  wordCardContainer.append(wordCardLeftSide, wordCardRightSide);

  return wordCardContainer;
};
