export const addElement = (tagType: string, className: string): HTMLElement => {
  const element = document.createElement(tagType);
  if(className != '') element.setAttribute('class', className);
  return element;
}

export const addTextElement = (tagType: string, className: string, text: string): HTMLElement => {
  const element = addElement(tagType, className);
  element.textContent = text;
  return element;
}
