import './AudioCall.scss';
import { addElement } from '../../utils/add-element';
import { getGameLevel, setGameLevel } from '../../utils/local-storage-helpers';
import { getWords } from '../../components/api/api';
import { getRandom } from '../../utils/get-random';
import { levelToGroup, shuffle } from '../../utils/micro-helpers';
import { Word } from '../../interfaces';
import { getSlide } from './game-slide';

const AMOUNT_PAGES_OF_GROUP = 29;
const AMOUNT_WORDS_IN_GAME = 10;

export const AudioCall = (): HTMLElement => {
  const page = addElement('main', 'audio-call-page') as HTMLElement;

  page.innerHTML = `
    <h2 class="audio-call-page__caption">АУДИОВЫЗОВ</h2>
    <p class="audio-call-page__desc">Игра "Аудиовызов" улучшит ваше восприятие на слух и понимание устной речи.</p>
    <div class="audio-call-page__difficulty difficulty">
      <p class="difficulty__caption">Выберите сложность игры</p>
      <ul id="audio-call-level" class="difficulty__list">
        <li data-level="a1" class="difficulty__item">A1</li>
        <li data-level="a2" class="difficulty__item">A2</li>
        <li data-level="b1" class="difficulty__item">B1</li>
        <li data-level="b2" class="difficulty__item">B2</li>
        <li data-level="c1" class="difficulty__item">C1</li>
        <li data-level="c2" class="difficulty__item">C2</li>
      </ul>
      <button ${getGameLevel() ? '' : 'disabled'} id="start-audio-call">Начать</button>
    </div>
  `;

  addListeners(page);
  return page;
};

function addListeners(element: HTMLElement) {
  const levelsArea = element.querySelector('#audio-call-level') as HTMLUListElement;
  const startButton = element.querySelector('#start-audio-call') as HTMLButtonElement;
  const levels = element.querySelectorAll('.difficulty__item') as NodeListOf<HTMLElement>;
  const activeLevel = getGameLevel();
  levels.forEach((item: HTMLElement) => {
    if (item.dataset.level === activeLevel) {
      item.classList.add('active');
    }
  });
  levelsArea.addEventListener('click', chooseLevel);
  startButton.addEventListener('click', startAudioCall.bind(null, '9', '2'));

  function chooseLevel(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.dataset.level) {
      setGameLevel(target.dataset.level);
      levels.forEach((item: HTMLElement) => item.classList.remove('active'));
      target.classList.add('active');
      startButton.disabled = false;
    }
  }
}

function startAudioCall(pageBook?: string, groupBook?: string) {
  //if call from textbook >>> we need attributes!

  const root = document.getElementById('root') as HTMLDivElement;
  const page: string = pageBook || String(getRandom(0, AMOUNT_PAGES_OF_GROUP));
  const group: string = groupBook || levelToGroup(getGameLevel());
  let wordsAnswer: Array<string>;
  let counter = 0;

  //container for slides
  const gameContainer = addElement('main', 'audio-call-game') as HTMLElement;

  getWords(page, group).then((response: Array<Word>) => {
    const tempArr: Array<Word> = [...response];
    shuffle(tempArr);

    const targetArr: Array<Word> = tempArr.slice(AMOUNT_WORDS_IN_GAME);
    const firstSlide = getSlide(targetArr[counter]) as HTMLElement;
    const ansArea = firstSlide.querySelector('.slide__answers') as HTMLDivElement;
    ansArea.addEventListener('click', checkAns);

    gameContainer.appendChild(firstSlide);

    root.innerHTML = '';
    root.appendChild(gameContainer);

    function checkAns(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (target.dataset) {
        const slide = document.querySelector('.audio-call-slide') as HTMLElement;
        const next = document.getElementById('audio-game-button') as HTMLButtonElement;
        //logic to check right answer
        slide.classList.add('done');
        next.disabled = false;
      }
    }
  });
}

export { startAudioCall };
