import { addElement } from '../../utils/add-element';
import wordListRender from './wordListRender';
import { getWords } from '../../components/api/api';
import { wordCardRender } from './wordRender';
import { pagination } from './Dictionary';

async function chapterListener(i: number) {
  const wordsArr = await getWords('0', `${i}`);
  const wordListWrapper = document.querySelector('.word-list-wrapper') as HTMLDivElement;
  const wordCardWrapper = document.querySelector('.word-card-wrapper') as HTMLDivElement;

  wordListWrapper.innerHTML = '';
  wordListWrapper.append(wordListRender(wordsArr));

  wordCardWrapper.innerHTML = '';
  wordCardWrapper.append(wordCardRender(wordsArr[0]));

  pagination.reset(30);
}

const chapterRender = (): HTMLDivElement => {
  const chapterList = addElement('div', 'chapter-list') as HTMLDivElement;

  for (let i = 0; i < 7; i++) {
    const chapterLabel = addElement('label', `chapter-label chapter-label_${i}`) as HTMLLabelElement;
    chapterLabel.setAttribute('for', `group-${i}`);
    chapterLabel.textContent = i < 6 ? `Раздел ${i + 1}` : 'Сложные слова';

    const chapterRadio = document.createElement('input');
    chapterRadio.type = 'radio';
    chapterRadio.name = 'chapter';
    chapterRadio.id = `group-${i}`;

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
