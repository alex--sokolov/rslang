import './Team.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { Dev } from './Developer';
import teamInfo from './team-info';
import { getUserStat, putUserStat } from '../../components/api/api';
import { getUserId } from '../../utils/local-storage-helpers';
import { GameWordStatExtended, IStatistics, IStatisticsGames, IStatisticsOptions } from '../../interfaces';
import { game } from '../../components/sprint/sprint-store';
import { bestSeries, getObjectStatistic } from '../AudioCall/gameComponents/game-statistic';
import gameVars from '../AudioCall/gameComponents/game-vars';

export const Team = (): HTMLElement => {
  const page = addElement('main', 'team-page') as HTMLElement;
  const description = addTextElement('div', 'team-description', 'Разработчики приложения') as HTMLElement;
  const container = addElement('div', 'team-container') as HTMLElement;
  container.appendChild(Dev(teamInfo.sokolov));
  container.appendChild(Dev(teamInfo.kalanda));
  container.appendChild(Dev(teamInfo.grachev));
  page.appendChild(description);
  page.appendChild(container);

  const xxx = document.querySelector('.navbar-name') as HTMLElement;
  xxx.style.cursor = 'pointer';
  xxx.addEventListener('click', async () => {
    /*const stat = await getUserStat(getUserId());
    console.log(stat);*/

    const answers: Array<boolean> = [false, false, true, true, false, false, true, true, true, true];
    const status: Array<string> = [
      'forgotten',
      'forgotten',
      'new',
      'new',
      'learned',
      'new',
      'new',
      'learned',
      'new',
      'new',
    ];

    const ans = await getObjectStatistic(answers, status);

    console.log(ans);

    //await putUserStat(getUserId(), statisticObj);
  });

  return page;
};
