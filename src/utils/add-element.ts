export const addElement = (tagType: string, className: string, id?: string): HTMLElement => {
  const element = document.createElement(tagType);
  if(className != '') element.setAttribute('class', className);
  if(id) element.id = id;
  return element;
}

export const addTextElement = (tagType: string, className: string, text: string): HTMLElement => {
  const element = addElement(tagType, className);
  element.textContent = text;
  return element;
}
