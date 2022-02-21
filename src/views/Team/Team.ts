import './Team.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { Dev } from './Developer';
import teamInfo from './team-info';

export const Team = (): HTMLElement => {
  const page = addElement('main', 'team-page') as HTMLElement;
  const description = addTextElement('div', 'team-description', 'Разработчики приложения') as HTMLElement;
  const container = addElement('div', 'team-container') as HTMLElement;
  container.appendChild(Dev(teamInfo.sokolov));
  container.appendChild(Dev(teamInfo.kalanda));
  container.appendChild(Dev(teamInfo.grachev));
  page.appendChild(description);
  page.appendChild(container);

  return page;
};
