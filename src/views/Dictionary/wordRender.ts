import { addElement, addTextElement } from '../../utils/add-element';
import { Word, WordExtended } from '../../interfaces';
import { getChapter, getUserId } from '../../utils/local-storage-helpers';
import voiceIco from '../../assets/svg/audio.svg';
import { lestenStateBtns } from './learnedAndDifficult';

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
  const currentChapter = getChapter() || '0';
  const wordId: string = word.id || word._id;

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

  const hardBtn = addTextElement(
    'button',
    `card__btn card__btn_hard color-chapter-${currentChapter}`,
    'Сложное'
  ) as HTMLButtonElement;
  const learnedBtn = addTextElement(
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
  if (getUserId()) btnsContainer.append(hardBtn, learnedBtn);

  wordCardContainer.append(wordCardLeftSide, wordCardRightSide);

  if (word.userWord) {
    wordCardContainer.classList.add(word.userWord.difficulty as string);
  } else {
    // wordCardContainer.classList.remove('easy');
  }

  voiceBtn.addEventListener('click', () => {
    playAudioTrigger(word);
  });

  hardBtn.addEventListener('click', (e) => lestenStateBtns(e, wordId, { difficulty: 'hard' }));
  learnedBtn.addEventListener('click', (e) => lestenStateBtns(e, wordId, { difficulty: 'learned' }));

  return wordCardContainer;
};
