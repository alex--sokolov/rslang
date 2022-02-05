import './Dictionary.scss';
import { addElement, addTextElement } from '../../utils/add-element';

export const Dictionary = (): HTMLElement => {
  const page = addElement('main', 'dictionary-page') as HTMLElement;
  const pageTitle = addTextElement('h1', 'page-title', 'Учебник') as HTMLElement;
  const chapterList = addElement('div', 'chapter-list') as HTMLElement;

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
  }

  page.append(pageTitle);
  page.append(chapterList);
  return page;
};
