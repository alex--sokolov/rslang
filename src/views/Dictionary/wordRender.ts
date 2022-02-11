import { addElement, addTextElement } from '../../utils/add-element';
import { Word } from '../../interfaces';
import { getCurrentChapter, getUserId } from '../../utils/local-storage-helpers';
import voiceIco from '../../assets/svg/audio.svg';

export const wordCardRender = (word: Word): HTMLDivElement => {
  const currentChapter = getCurrentChapter();
  const wordCardContainer = addElement('div', `word-card card card--chapter-${currentChapter}`) as HTMLDivElement;
  const wordCardLeftSide = addElement('div', 'card__left-side') as HTMLDivElement;
  const wordCardRightSide = addElement('div', 'card__right-side') as HTMLDivElement;
  const btnsContainer = addElement('div', 'card__btns-container') as HTMLDivElement;

  const image =`<img src="https://rs-lang-app-server.herokuapp.com/${word.image}" class="card__img" alt="Иллюстрация слова">`;
  const wordEng = addTextElement('strong', 'card__word', `${word.word} - `) as HTMLHeadingElement;
  const transcription = addTextElement('span', 'card__transcription', `${word.transcription} - `) as HTMLSpanElement;
  const translate = addTextElement('span', 'card__translate', `${word.wordTranslate}`) as HTMLParagraphElement;
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
  const voiceIcon = addElement('img', 'card__voice-icon') as HTMLImageElement;
  voiceIcon.src = voiceIco;

  voiceBtn.append(voiceIcon);

  const wordCheckboxes = `
    <div class="card__checkbox-wrapper color-chapter-${currentChapter}">
      <input type="checkbox" name="hard-word" id="hard-word-checkbox" class="card__checkbox">
      <label for="hard-word-checkbox" class="card__label">Сложное</label>
    </div>
    <div class="card__checkbox-wrapper color-chapter-${currentChapter}">
      <input type="checkbox" name="learned-word" id="learned-word-checkbox" class="card__checkbox">
      <label for="learned-word-checkbox" class="card__label">Изученное</label>
    </div>
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
