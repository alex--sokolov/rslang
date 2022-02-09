import playSound from './play-sound';
import gameVars from './game-vars';

function switchSlide() {
  const currentSlide = document.querySelector('.audio-call-slide.done') as HTMLElement;
  const nextSlide = document.querySelector('.audio-call-slide.hide') as HTMLElement;
  const audio = nextSlide.querySelector('.slide__audio-element') as HTMLAudioElement;
  setTimeout(playSound.bind(null, audio), gameVars.AUDIO_DELAY);

  currentSlide?.classList.add('completed');
  nextSlide?.classList.remove('hide');
}

export default switchSlide;
