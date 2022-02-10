import { addElement } from '../../utils/add-element';
import wordListRender from './wordListRender';
import { getWords } from '../../components/api/api';
import { wordCardRender } from './wordRender';
import { pagination } from './Dictionary';
import { setCurrentPage, setCurrentChapter } from '../../utils/local-storage-helpers';

async function chapterListener(i: number) {
  const wordsArr = await getWords('0', `${i}`);

  const wordsContainerElement = document.querySelector('.dictionary-words-container') as HTMLDivElement;

  wordsContainerElement.innerHTML = '';
  wordsContainerElement.append(wordCardRender(wordsArr[0]), wordListRender(wordsArr));

  pagination.reset(30);

  setCurrentPage('0');
  setCurrentChapter(`${i}`);
}

const chapterRender = (): HTMLDivElement => {
  const chapterList = addElement('div', 'chapter-list') as HTMLDivElement;

  for (let i = 0; i < 7; i++) {
    const chapterLabel = addElement('label', `chapter-label chapter-label_${i}`) as HTMLLabelElement;
    chapterLabel.setAttribute('for', `chapter-${i}`);
    chapterLabel.textContent = i < 6 ? `Раздел ${i + 1}` : 'Сложные слова';

    const chapterRadio = document.createElement('input');
    chapterRadio.type = 'radio';
    chapterRadio.name = 'chapter';
    chapterRadio.id = `chapter-${i}`;

    if (i === 0) {
      chapterRadio.checked = true;
    }

    const chapterWordsNums = addElement('p', 'chapter-words-nums') as HTMLSpanElement;
    chapterWordsNums.textContent = `${i * 600 + 1}-${(i + 1) * 600}`;

    if (i < 6) chapterLabel.append(chapterWordsNums);
    chapterList.append(chapterRadio);
    chapterList.append(chapterLabel);

    chapterRadio.addEventListener('click', () => chapterListener(i));
  }

  return chapterList;
};

export default chapterRender;
