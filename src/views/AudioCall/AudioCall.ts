import './AudioCall.scss';
import { addElement } from '../../utils/add-element';
import { getGameLevel, setGameLevel } from '../../utils/local-storage-helpers';

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
      <button class="difficulty__button">Начать</button>
    </div>
  `;

  addListeners(page);
  return page;
};

function addListeners(element: HTMLElement) {
  const levelsArea = element.querySelector('#audio-call-level') as HTMLUListElement;
  const levels = element.querySelectorAll('.difficulty__item') as NodeListOf<HTMLElement>;
  const activeLevel = getGameLevel();
  levels.forEach((item: HTMLElement) => {
    if (item.dataset.level === activeLevel) {
      item.classList.add('active');
    }
  });
  levelsArea.addEventListener('click', chooseLevel);

  function chooseLevel(event: MouseEvent) {
    const target = event.target as HTMLElement;
    levels.forEach((item: HTMLElement) => item.classList.remove('active'));

    if (target.dataset.level) {
      setGameLevel(target.dataset.level);
      target.classList.add('active');
    }
  }
}
