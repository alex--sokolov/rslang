import './AudioCall.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { getGameLevel, getGroup, getPage, setGameLevel } from '../../utils/local-storage-helpers';
import { getWords } from '../../components/api/api';
import { getRandom } from '../../utils/get-random';
import { Word } from '../../interfaces';
import { levelToGroup, shuffle } from '../../utils/micro-helpers';
import { getEmptySlide, getSlide } from './gameComponents/game-slide';
import playSound from './gameComponents/play-sound';
import switchSlide from './gameComponents/switch-slide';
import getAnswers from './gameComponents/answers-list';
import gameVars from './gameComponents/game-vars';
import { showModal } from '../../utils/show-modal';
import { AudioCallResult } from './gameComponents/AudioCall-result';

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
  const group: string = callPlace === 'fromBook' ? getGroup() : levelToGroup(getGameLevel());

  gameVars.statistic.length = 0;
  let counter = 0;

  //create container for slides
  const gameContainer = addElement('main', 'audio-call-game') as HTMLElement;

  //request needed words(depending page and group)
  getWords(page, group).then((response: Array<Word>) => {
    if (response.length) gameVars.AMOUNT_WORDS_IN_CHUNK = response.length;

    //get shuffled array targetArr(10)
    const tempArr: Array<Word> = [...response];
    shuffle(tempArr);
    const targetArr: Array<Word> = tempArr.slice(0, gameVars.AMOUNT_WORDS_IN_GAME);

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
        ansArea.addEventListener('click', checkAns);
        gameContainer.appendChild(slide);
        if (counter === 0) {
          setTimeout(playSound.bind(null, audio), gameVars.AUDIO_DELAY);
        }
      } else {
        gameContainer.appendChild(getEmptySlide());
      }
    }

    insertSlide();
    root.innerHTML = '';
    root.appendChild(gameContainer);

    function checkAns(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (target.dataset.id) {
        //find and delete previous slide if it exists
        const completedSlide = document.querySelector('.audio-call-slide.completed') as HTMLElement;
        completedSlide?.remove();

        // @ts-ignore
        const gogogo = new CircularProgressBar('pie');
        gogogo.initial();

        //clear unnecessary handler
        const currentSlide = document.querySelector('.audio-call-slide') as HTMLElement;
        const ansArea = currentSlide.querySelector('.slide__answers') as HTMLDivElement;
        ansArea.removeEventListener('click', checkAns);

        //logic to check right answer
        const currentAns: boolean = target.dataset.id === currentSlide.dataset.id;
        const rightAns = currentSlide.querySelector(`[data-id='${currentSlide.dataset.id}']`) as HTMLSpanElement;
        gameVars.statistic.push(currentAns);
        if (currentAns) {
          target.classList.add('right');
        } else {
          target.classList.add('wrong');
          rightAns.classList.add('right');
        }

        //adding next slide to game
        counter = counter + 1;
        insertSlide('hide');

        //change view after answer
        currentSlide.classList.add('done');

        const nextBut = document.querySelector('.audio-game-button') as HTMLButtonElement;
        nextBut.disabled = false;
        if (counter === 10) {
          nextBut.innerText = 'Результаты';
          nextBut.addEventListener('click', () => {
            switchSlide();
            showModal(AudioCallResult(gameVars.statistic, targetArr));
          });
        } else {
          nextBut.addEventListener('click', switchSlide);
        }
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

  if (callPlace === 'fromBook') {
    addListeners(page, 'fromBook');
  } else {
    addListeners(page);
  }
  return page;
};

export { AudioCall, startAudioCall };
