import './AudioCall.scss';
import { addElement } from '../../utils/add-element';
import { getGameLevel, setGameLevel } from '../../utils/local-storage-helpers';
import { getWords } from '../../components/api/api';
import { getRandom } from '../../utils/get-random';
import { levelToGroup, shuffle } from '../../utils/micro-helpers';
import { Word } from '../../interfaces';
import { getEmptySlide, getSlide } from './game-slide';

const AMOUNT_PAGES_OF_GROUP = 29;
const AMOUNT_WORDS_IN_GAME = 10;
const AMOUNT_ANS_IN_GAME = 6;
let AMOUNT_WORDS_IN_CHUNK = 20;
const AUDIO_DELAY = 800;

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
  startButton.addEventListener('click', startAudioCall.bind(null, '8', '2'));

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
  const statistic: Array<boolean> = [];
  let counter = 0;

  //create container for slides
  const gameContainer = addElement('main', 'audio-call-game') as HTMLElement;

  //request needed words(depending page and group)
  getWords(page, group).then((response: Array<Word>) => {
    if (response.length) AMOUNT_WORDS_IN_CHUNK = response.length;
    //get shuffled array targetArr(10)
    const tempArr: Array<Word> = [...response];
    shuffle(tempArr);
    const targetArr: Array<Word> = tempArr.slice(0, AMOUNT_WORDS_IN_GAME);

    //create array with word have to use in answers
    const answers: Array<Word> = [...getAnswers(tempArr, counter)];

    //create first slide >>> pass attr from our prepare array
    const firstSlide = getSlide(targetArr[counter], answers) as HTMLElement;
    const ansArea = firstSlide.querySelector('.slide__answers') as HTMLDivElement;
    const soundBut = firstSlide.querySelector('.audio-game-sound') as HTMLDivElement;
    const audio = firstSlide.querySelector('.slide__audio-element') as HTMLAudioElement;

    setTimeout(playSound.bind(null, audio), AUDIO_DELAY);
    soundBut.addEventListener('click', playSound.bind(null, audio));
    ansArea.addEventListener('click', checkAns);

    gameContainer.appendChild(firstSlide);

    root.innerHTML = '';
    root.appendChild(gameContainer);

    function checkAns(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (target.dataset.id) {
        //find and delete previous slide if it exists
        const completedSlide = document.querySelector('.audio-call-slide.completed') as HTMLElement;
        completedSlide?.remove();

        //clear unnecessary handler
        const currentSlide = document.querySelector('.audio-call-slide') as HTMLElement;
        const ansArea = currentSlide.querySelector('.slide__answers') as HTMLDivElement;
        ansArea.removeEventListener('click', checkAns);

        //logic to check right answer
        const currentAns: boolean = target.dataset.id === currentSlide.dataset.id;
        const rightAns = currentSlide.querySelector(`[data-id='${currentSlide.dataset.id}']`) as HTMLSpanElement;
        statistic.push(currentAns);
        if (currentAns) {
          target.classList.add('right');
        } else {
          target.classList.add('wrong');
          rightAns.classList.add('right');
        }

        //adding next slide to game
        counter = counter + 1;
        insertNewSlide();

        //change view after answer
        currentSlide.classList.add('done');

        const nextBut = document.querySelector('.audio-game-button') as HTMLButtonElement;
        nextBut.disabled = false;
        nextBut.addEventListener('click', switchSlide);
      }

      function insertNewSlide() {
        if (counter !== 10) {
          const answers: Array<Word> = getAnswers(tempArr, counter);
          const newSlide = getSlide(targetArr[counter], answers, 'hide') as HTMLElement;
          const audio = newSlide.querySelector('.slide__audio-element') as HTMLAudioElement;
          const ansArea = newSlide.querySelector('.slide__answers') as HTMLDivElement;
          const soundBut = newSlide.querySelector('.audio-game-sound') as HTMLDivElement;

          soundBut.addEventListener('click', playSound.bind(null, audio));
          ansArea.addEventListener('click', checkAns);
          gameContainer.appendChild(newSlide);
        } else {
          gameContainer.appendChild(getEmptySlide());
        }
      }
    }
    function getAnswers(arr: Array<Word>, counter: number): Array<Word> {
      const pos: Array<number> = [counter];
      while (pos.length < AMOUNT_ANS_IN_GAME) {
        const newNum: number = getRandom(0, AMOUNT_WORDS_IN_CHUNK - 1);
        if (!pos.includes(newNum)) pos.push(newNum);
      }
      const output = pos.map((pos: number): Word => arr[pos]);
      shuffle(output);
      return output;
    }
    function switchSlide() {
      const currentSlide = document.querySelector('.audio-call-slide.done') as HTMLElement;
      const nextSlide = document.querySelector('.audio-call-slide.hide') as HTMLElement;
      const audio = nextSlide.querySelector('.slide__audio-element') as HTMLAudioElement;
      setTimeout(playSound.bind(null, audio), AUDIO_DELAY);

      currentSlide?.classList.add('completed');
      nextSlide?.classList.remove('hide');
    }
    function playSound(element: HTMLAudioElement) {
      element?.play();
    }
  });
}

export { startAudioCall };
