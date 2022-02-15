import { addElement } from '../../utils/add-element';
import wordListRender from './wordListRender';
import { getUserAggregatedWords, getWords } from '../../components/api/api';
import { wordCardRender } from './wordRender';
import { getWordsFunc, pagination } from './Dictionary';
import { setPage, setChapter, getUserId } from '../../utils/local-storage-helpers';
import { aggregatedWordsResponse, WordExtended } from '../../interfaces';

async function chapterListener(i: number) {
  const wordsArr = await getWordsFunc(`${i}`, '0');

  const wordsContainerElement = document.querySelector('.dictionary-words-container') as HTMLDivElement;

  setPage('0');
  setChapter(`${i}`);

  wordsContainerElement.innerHTML = '';
  wordsContainerElement.append(wordCardRender(wordsArr[0]), wordListRender(wordsArr));

  pagination.reset(30);
}

const chapterRender = (): HTMLDivElement => {
  const chapterList = addElement('div', 'chapter-list') as HTMLDivElement;
  const chapterCount = getUserId() ? 7 : 6;

  for (let i = 0; i < chapterCount; i++) {
    const chapterLabel = addElement('label', `chapter-label color-chapter-${i}`) as HTMLLabelElement;
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
