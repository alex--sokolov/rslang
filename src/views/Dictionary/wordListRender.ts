import { addElement } from '../../utils/add-element';
import { Word, WordExtended } from '../../interfaces';
import { wordCardRender } from './wordRender';
import { getChapter } from '../../utils/local-storage-helpers';

const wordListRender = (words: WordExtended[]): HTMLDivElement => {
  console.log(words);

  const wordListContainer = addElement('div', 'word-list') as HTMLDivElement;
  const currentChapter = getChapter() || '0';

  words.forEach((word, i) => {
    const wordButton = addElement('button', `word-item color-chapter-${currentChapter}`) as HTMLButtonElement;
    if (i === 0) {
      wordButton.classList.add('word-item_active');
    }

    wordButton.setAttribute('data-word-id', word.id ? word.id : word._id);
    const wordEng = document.createElement('h3') as HTMLHeadingElement;
    wordEng.textContent = word.word;
    const wordTranslate = document.createElement('p') as HTMLParagraphElement;
    wordTranslate.textContent = word.wordTranslate;

    if (word.userWord) {
      wordButton.classList.add(`word-item_${word.userWord.difficulty}`);
    }

    wordButton.append(wordEng, wordTranslate);
    wordListContainer.append(wordButton);

    wordButton.addEventListener('click', () => {
      const activeWordBtn = wordListContainer.querySelector('.word-item_active') as HTMLButtonElement;
      activeWordBtn.classList.remove('word-item_active');
      wordButton.classList.add('word-item_active');

      const wordsContainerElement = document.querySelector('.dictionary-words-container') as HTMLDivElement;
      const wordCardElement = wordsContainerElement.firstElementChild as HTMLDivElement;
      wordCardElement.remove();
      wordsContainerElement.prepend(wordCardRender(word));
    });
  });

  return wordListContainer;
};

export default wordListRender;
