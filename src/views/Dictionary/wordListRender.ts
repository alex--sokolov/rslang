import { addElement } from '../../utils/add-element';
import { Word } from '../../interfaces';
import { wordCardRender } from './wordRender';

const wordListRender = (words: Word[]): HTMLDivElement => {
  const wordListContainer = addElement('div', 'word-list') as HTMLDivElement;

  words.forEach((word, i) => {
    const wordButton = addElement('button', 'word-item') as HTMLButtonElement;

    if (i === 0) {
      wordButton.classList.add('word-item--active');
    }

    wordButton.setAttribute('data-word-id', word.id);
    const wordEng = document.createElement('h3') as HTMLHeadingElement;
    wordEng.textContent = word.word;
    const wordTranslate = document.createElement('p') as HTMLParagraphElement;
    wordTranslate.textContent = word.wordTranslate;

    wordButton.append(wordEng, wordTranslate);
    wordListContainer.append(wordButton);

    wordButton.addEventListener('click', () => {
      const activeWordBtn = wordListContainer.querySelector('.word-item--active') as HTMLButtonElement;
      activeWordBtn.classList.remove('word-item--active');
      wordButton.classList.add('word-item--active');

      const wordCardWrapper = document.querySelector('.word-card-wrapper') as HTMLDivElement;
      wordCardWrapper.innerHTML = '';
      wordCardWrapper.append(wordCardRender(word));
    });
  });

  return wordListContainer;
};

export default wordListRender;
