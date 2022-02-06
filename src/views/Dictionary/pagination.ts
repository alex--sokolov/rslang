import { addElement } from '../../utils/add-element';

const dictionaryPagination = (): HTMLUListElement => {
  const pagination = addElement('ul', 'dictionary-pagination pagination') as HTMLUListElement;

  for (let i = 0; i < 32; i++) {
    const liElement = document.createElement('li') as HTMLLIElement;
    const buttonElement = addElement('button', 'pagination__button') as HTMLButtonElement;

    if (i === 0) {
      buttonElement.innerHTML = '&lt;';
    } else if (i === 31) {
      buttonElement.innerHTML = '&gt;';
    } else {
      buttonElement.textContent = `${i}`;
    }

    liElement.append(buttonElement);
    pagination.append(liElement);
  }

  return pagination;
};

export default dictionaryPagination;
