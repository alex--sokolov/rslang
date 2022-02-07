import { addElement } from '../../utils/add-element';
import { Word } from '../../interfaces';
import { baseUrl } from '../../components/api/api';
import soundIcon from '../../assets/img/sound.svg';

function getSlide(param: Word, type?: string): HTMLElement {
  const slide = addElement('div', 'audio-call-slide slide') as HTMLDivElement;
  if (type) slide.classList.add('hide');

  slide.innerHTML = `
    <div class="slide__question">
      <div class="slide__image">
        <img src=${baseUrl + param.image} alt="word image">
      </div>
      <div class="slide__sound">
        <span>${param.word}</span>
        <img src=${soundIcon} id="audio-game-sound" alt="play word">
      </div>
    </div>
    <div class="slide__answers">
      <div class="slide__answers-row">
        <span class="slide__answers__item">rgsjhsgh</span>
        <span class="slide__answers__item">sdfghsgdfh</span>
        <span class="slide__answers__item">fghfh</span>
      </div>
      <div class="slide__answers-row">
        <span class="slide__answers__item">fghfgh</span>
        <span class="slide__answers__item">fghfg</span>
        <span class="slide__answers__item">fghfghrt</span>
      </div>
    </div>
    <button disabled class="slide__button" id="audio-game-button">Дальше</button>
  `;

  return slide;
}

export { getSlide };
