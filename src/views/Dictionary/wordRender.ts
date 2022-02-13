import { addElement, addTextElement } from '../../utils/add-element';
import { Word, WordExtended } from '../../interfaces';
import { getCurrentChapter, getUserId } from '../../utils/local-storage-helpers';
import voiceIco from '../../assets/svg/audio.svg';
import { lestenCheckboxes } from './learnedAndDifficult';

let isAudioPlaying = false;

function playAudioTrigger(word: Word | WordExtended): void {
  const audioArr = [
    `https://rs-lang-app-server.herokuapp.com/${word.audio}`,
    `https://rs-lang-app-server.herokuapp.com/${word.audioMeaning}`,
    `https://rs-lang-app-server.herokuapp.com/${word.audioExample}`,
  ];

  if (isAudioPlaying) return;

  const playAudio = (num: number) => {
    let audioNum = num;
    const audio = new Audio();
    audio.src = audioArr[audioNum];
    audio.autoplay = true;
    audioNum += 1;
    isAudioPlaying = true;

    audio.addEventListener('loadedmetadata', () => {
      if (audioNum >= audioArr.length) {
        setTimeout(() => (isAudioPlaying = false), audio.duration * 1000 + 500);
        return;
      }
      setTimeout(() => playAudio(audioNum), audio.duration * 1000);
    });
  };

  playAudio(0);
}

export const wordCardRender = (word: WordExtended): HTMLDivElement => {
  const currentChapter = getCurrentChapter();

  const wordCardContainer = addElement('div', `word-card card card--chapter-${currentChapter}`) as HTMLDivElement;
  const wordCardLeftSide = addElement('div', 'card__left-side') as HTMLDivElement;
  const wordCardRightSide = addElement('div', 'card__right-side') as HTMLDivElement;
  const btnsContainer = addElement('div', 'card__btns-container') as HTMLDivElement;

  const image = `<img src="https://rs-lang-app-server.herokuapp.com/${word.image}" class="card__img" alt="Иллюстрация слова">`;
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
  const voiceBtn = addElement('button', `card__voice-btn color-chapter-${currentChapter}`) as HTMLButtonElement;
  const voiceIcon = addElement('img', 'card__voice-icon') as HTMLImageElement;
  voiceIcon.src = voiceIco;
  voiceBtn.append(voiceIcon);

  // const checkboxHardWrapper = addElement(
  //   'div',
  //   `card__checkbox-wrapper color-chapter-${currentChapter}`
  // ) as HTMLDivElement;
  // const checkboxHard = addElement('input', 'card__checkbox', 'hard-word-checkbox') as HTMLInputElement;
  // checkboxHard.type = 'radio';
  // checkboxHard.name = 'word-difficulty';
  // const labelHard = addTextElement('label', 'card__label', 'Сложное') as HTMLLabelElement;
  // labelHard.setAttribute('for', 'hard-word-checkbox');
  // checkboxHardWrapper.append(checkboxHard, labelHard);

  // const checkboxLearnedWrapper = addElement(
  //   'div',
  //   `card__checkbox-wrapper color-chapter-${currentChapter}`
  // ) as HTMLDivElement;
  // const checkboxLearned = addElement('input', 'card__checkbox', 'learned-word-checkbox') as HTMLInputElement;
  // checkboxLearned.type = 'radio';
  // checkboxLearned.name = 'word-difficulty';
  // const labelLearned = addTextElement('label', 'card__label', 'Изученное') as HTMLLabelElement;
  // labelLearned.setAttribute('for', 'learned-word-checkbox');
  // checkboxLearnedWrapper.append(checkboxLearned, labelLearned);

  const hardButtun = addTextElement(
    'button',
    `card__btn card__btn_hard color-chapter-${currentChapter}`,
    'Сложное'
  ) as HTMLButtonElement;
  const learnedButtun = addTextElement(
    'button',
    `card__btn card__btn_learned color-chapter-${currentChapter}`,
    'Изученное'
  ) as HTMLButtonElement;

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
  btnsContainer.append(hardButtun, learnedButtun);

  wordCardContainer.append(wordCardLeftSide, wordCardRightSide);

  if (word.userWord) {
    wordCardContainer.classList.add(word.userWord.difficulty);
  } else {
    // wordCardContainer.classList.remove('easy');
  }

  voiceBtn.addEventListener('click', () => {
    playAudioTrigger(word);
  });

  hardButtun.addEventListener('click', (e) => lestenCheckboxes(e, word.id, { difficulty: 'hard' }));
  learnedButtun.addEventListener('click', (e) => lestenCheckboxes(e, word.id, { difficulty: 'learned' }));

  return wordCardContainer;
};
