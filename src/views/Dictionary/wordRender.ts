import { addElement, addTextElement } from '../../utils/add-element';
import { Word } from '../../interfaces';

export const wordCardRender = (word: Word): HTMLDivElement => {
  const wordCardContainer = addElement('div', 'word-card card') as HTMLDivElement;
  const cardImage = addElement('img', 'card__img') as HTMLImageElement;
  cardImage.src = `https://rs-lang-app-server.herokuapp.com/${word.image}`;
  cardImage.alt = 'Иллюстрация слова';
  const cardWord = addTextElement('h3', 'card__word', `${word.word}`) as HTMLHeadingElement;
  const cardTranscription = addTextElement('span', 'card__transcription', `${word.transcription}`) as HTMLSpanElement;
  const cardVoiceBtn = addElement('button', 'card__voice-btn') as HTMLButtonElement;
  const cardTranslate = addTextElement('h4', 'card__translate', `${word.wordTranslate}`) as HTMLParagraphElement;
  const cardSubheading = addTextElement('h5', 'card__subheading', 'Значение') as HTMLHeadingElement;
  const cardTextMeaning = addElement('p', 'card__text') as HTMLParagraphElement;
  cardTextMeaning.insertAdjacentHTML('beforeend', word.textMeaning);
  const cardTextMeaningTranslate = addTextElement(
    'p',
    'card__text',
    `${word.textMeaningTranslate}`
  ) as HTMLParagraphElement;
  const cardSubheading2 = addTextElement('h5', 'card__subheading', 'Пример') as HTMLHeadingElement;
  const cardTextExample = addElement('p', 'card__text') as HTMLParagraphElement;
  cardTextExample.insertAdjacentHTML('beforeend', word.textExample);
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

  return wordCardContainer;
};
