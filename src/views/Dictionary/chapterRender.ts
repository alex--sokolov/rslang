import { addElement } from '../../utils/add-element';
import wordListRender from './wordListRender';
import { getWords } from '../../components/api/api';

const chapterRender = (): HTMLDivElement => {
  const chapterList = addElement('div', 'chapter-list') as HTMLDivElement;

  for (let i = 0; i < 6; i++) {
    const chapterLabel = addElement('label', 'chapter-label') as HTMLLabelElement;
    chapterLabel.setAttribute('for', `group-${i}`);
    chapterLabel.textContent = `Часть ${i + 1}`;

    const chapterRadio = document.createElement('input');
    chapterRadio.type = 'radio';
    chapterRadio.name = 'chapter';
    chapterRadio.id = `group-${i}`;

    if (i === 0) {
      chapterRadio.checked = true;
    }

    const chapterWordsNums = addElement('p', 'chapter-words-nums') as HTMLSpanElement;
    chapterWordsNums.textContent = `${i * 600 + 1}-${(i + 1) * 600}`;

    chapterLabel.append(chapterWordsNums);
    chapterList.append(chapterRadio);
    chapterList.append(chapterLabel);

    chapterRadio.addEventListener('click', async () => {
      const wordsArr = await getWords('0', `${i}`);
      const wordListWrapper = document.querySelector('.word-list-wrapper') as HTMLDivElement;

      wordListWrapper.innerHTML = '';
      wordListWrapper.append(wordListRender(wordsArr));
    });
  }

  return chapterList;
};

export default chapterRender;
