import './AudioCall.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { getGameLevel, getChapter, getPage, getUserId, setGameLevel } from '../../utils/local-storage-helpers';
import { getWords } from '../../components/api/api';
import { getRandom } from '../../utils/get-random';
import { Word, WordExtended } from '../../interfaces';
import playSound from './gameComponents/play-sound';
import getAnswers from './gameComponents/answers-list';
import { showModal } from '../../utils/show-modal';
import { AudioCallResult } from './gameComponents/AudioCall-result';
import gameVars from './gameComponents/game-vars';
import { levelToGroup, shuffle } from '../../utils/micro-helpers';
import { getEmptySlide, getSlide } from './gameComponents/game-slide';
import updateWord from './gameComponents/update-word';

//for button on dictionary page >>>
/*BUTTON_ON_DICTIONARY_PAGE.addEventListener('click', () => {
  const root = document.getElementById('root') as HTMLElement;
  root.innerHTML = '';
  root.appendChild(AudioCall('fromBook'));
});*/

function startAudioCall(callPlace?: string) {
  //if call from textbook >>> we need attributes!
  const root = document.getElementById('root') as HTMLDivElement;
  const page: string = callPlace === 'fromBook' ? getPage() : String(getRandom(0, gameVars.AMOUNT_PAGES_OF_GROUP));
  const group: string = callPlace === 'fromBook' ? getChapter() : levelToGroup(getGameLevel());

  gameVars.statistic.length = 0;
  let counter = 0;

  //create container for slides
  const gameContainer = addElement('main', 'audio-call-game') as HTMLElement;

  //request needed words(depending page and group)
  getWords(group, page).then((response: Array<WordExtended>) => {
    if (response.length) gameVars.AMOUNT_WORDS_IN_CHUNK = response.length;

    //get shuffled array targetArr(10)
    const tempArr: Array<WordExtended> = [...response];
    shuffle(tempArr);
    const targetArr: Array<WordExtended> = tempArr.slice(0, gameVars.AMOUNT_WORDS_IN_GAME);

    function insertSlide(type?: string) {
      if (counter !== 10) {
        //create array with word have to use in answers
        const answers: Array<Word> = [...getAnswers(tempArr, counter)];

        //create slide >>> pass attr from our prepared arrays
        const slide = getSlide(targetArr[counter], answers, type === 'hide' ? 'hide' : '');
        const audio = slide.querySelector('.slide__audio-element') as HTMLAudioElement;
        const ansArea = slide.querySelector('.slide__answers') as HTMLDivElement;
        const soundBut = slide.querySelector('.audio-game-sound') as HTMLDivElement;

        soundBut.addEventListener('click', playSound.bind(null, audio));
        ansArea.addEventListener('click', checkMouseAns);
        gameContainer.appendChild(slide);
        if (counter === 0) {
          setTimeout(playSound.bind(null, audio), gameVars.AUDIO_DELAY);
        }
      } else {
        gameContainer.appendChild(getEmptySlide());
      }
    }

    function switchSlide() {
      const currentSlide = document.querySelector('.audio-call-slide.done') as HTMLElement;
      const nextSlide = document.querySelector('.audio-call-slide.hide') as HTMLElement;
      const audio = nextSlide.querySelector('.slide__audio-element') as HTMLAudioElement;
      setTimeout(playSound.bind(null, audio), gameVars.AUDIO_DELAY);

      currentSlide?.classList.add('completed');
      nextSlide?.classList.remove('hide');
      if (counter !== 10) document.addEventListener('keydown', checkKeyboardAns);
      document.removeEventListener('keydown', switchSlide);
      document.removeEventListener('keydown', switchSlideFinal);
    }
    function switchSlideFinal() {
      switchSlide();
      showModal(AudioCallResult(gameVars.statistic, targetArr));
    }
    function delCompletedSlide() {
      //find and delete previous slide if it exists
      const completedSlide = document.querySelector('.audio-call-slide.completed') as HTMLElement;
      completedSlide?.remove();
    }

    insertSlide();
    root.innerHTML = '';
    root.appendChild(gameContainer);
    document.addEventListener('keydown', checkKeyboardAns);

    function checkAnsBasicLogic(target: HTMLElement) {
      //clear unnecessary handler
      const currentSlide = document.querySelector('.audio-call-slide') as HTMLElement;
      const ansArea = currentSlide.querySelector('.slide__answers') as HTMLDivElement;
      ansArea.removeEventListener('click', checkMouseAns);
      document.removeEventListener('keydown', checkKeyboardAns);

      //adding next slide to game
      counter = counter + 1;
      insertSlide('hide');

      //logic to check right answer
      const currentAns: boolean = target.dataset.id === currentSlide.dataset.id;
      const rightAns = currentSlide.querySelector(`[data-id='${currentSlide.dataset.id}']`) as HTMLSpanElement;
      if (getUserId()) updateWord(targetArr[counter - 1], currentAns);

      gameVars.statistic.push(currentAns);
      if (currentAns) {
        target.classList.add('right');
      } else {
        target.classList.add('wrong');
        rightAns.classList.add('right');
      }

      //change view after answer
      currentSlide.classList.add('done');
      const nextBut = document.querySelector('.audio-game-button') as HTMLButtonElement;
      nextBut.disabled = false;
      if (counter === 10) {
        nextBut.innerText = 'Результаты';
        nextBut.addEventListener('click', switchSlideFinal);
        document.addEventListener('keydown', switchSlideFinal);
      } else {
        nextBut.addEventListener('click', switchSlide);
        document.addEventListener('keydown', switchSlide);
      }
    }
    function checkMouseAns(event: MouseEvent): void {
      delCompletedSlide();
      const target = event.target as HTMLElement;
      if (target.dataset.id) checkAnsBasicLogic(target);
    }
    function checkKeyboardAns(event: KeyboardEvent): void {
      delCompletedSlide();
      if (gameVars.approved_KK.includes(event.keyCode)) {
        //check keyCode for separate pressing the main key from pressing the side keyboard
        const target =
          event.keyCode > 90
            ? (document.querySelector(`[data-num='${event.keyCode}']`) as HTMLElement)
            : (document.querySelector(`[data-key='${event.keyCode}']`) as HTMLElement);
        checkAnsBasicLogic(target);
      }
    }
  });
}

function addListeners(element: HTMLElement, callPlace?: string) {
  const levelsArea = element.querySelector('#audio-call-level') as HTMLUListElement;
  const startButton = element.querySelector('#start-audio-call') as HTMLButtonElement;
  const levels = element.querySelectorAll('.difficulty__item') as NodeListOf<HTMLElement>;
  const activeLevel = getGameLevel();
  levels.forEach((item: HTMLElement) => {
    if (item.dataset.level === activeLevel) {
      item.classList.add('active');
    }
  });
  function chooseLevel(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.dataset.level) {
      setGameLevel(target.dataset.level);
      levels.forEach((item: HTMLElement) => item.classList.remove('active'));
      target.classList.add('active');
      startButton.disabled = false;
    }
  }
  levelsArea?.addEventListener('click', chooseLevel);
  startButton.addEventListener('click', startAudioCall.bind(null, callPlace));
}

const AudioCall = (callPlace?: string): HTMLElement => {
  const page = addElement('main', 'audio-call-page') as HTMLElement;

  const levels: Array<string> = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const dataLevels: Array<string> = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

  const pageCaption = addTextElement('h2', 'audio-call-page__caption', 'АУДИОВЫЗОВ');
  const pageDesc = addElement('p', 'audio-call-page__desc');
  pageDesc.innerText = 'Игра "Аудиовызов" улучшит ваше восприятие на слух и понимание устной речи.';
  const levelsBlock = addElement('div', 'audio-call-page__difficulty difficulty');
  const levelsBlockDesc = addTextElement('p', 'difficulty__caption', 'Выберите сложность игры');
  const levelsList = addElement('ul', 'difficulty__list');
  levelsList.id = 'audio-call-level';
  levels.forEach((item, index) => {
    const elem = addTextElement('li', 'difficulty__item', levels[index]);
    elem.dataset.level = dataLevels[index];
    levelsList.appendChild(elem);
  });
  const startBut = addTextElement('button', 'start-audio-call', 'Начать') as HTMLButtonElement;
  startBut.id = 'start-audio-call';
  const warning = addTextElement(
    'div',
    'audio-call-page__warn',
    'Внимание! Чтобы сохранять прогресс обучения выполните вход в аккаунт.'
  );
  if (callPlace === 'fromBook') {
    startBut.disabled = false;
  } else {
    startBut.disabled = !getGameLevel();
  }
  if (!(callPlace === 'fromBook')) {
    levelsBlock.appendChild(levelsBlockDesc);
    levelsBlock.appendChild(levelsList);
  }
  levelsBlock.appendChild(startBut);
  page.appendChild(pageCaption);
  page.appendChild(pageDesc);
  page.appendChild(levelsBlock);
  if (!getUserId()) page.appendChild(warning);

  if (callPlace === 'fromBook') {
    addListeners(page, 'fromBook');
  } else {
    addListeners(page);
  }
  return page;
};

export { AudioCall, startAudioCall };
