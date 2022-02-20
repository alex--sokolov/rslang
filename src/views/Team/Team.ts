import './Team.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { Dev } from './Developer';
import teamInfo from './team-info';
import { getUserStat, putUserStat } from '../../components/api/api';
import { getUserId } from '../../utils/local-storage-helpers';
import { GameWordStatExtended, IStatistics, IStatisticsGames, IStatisticsOptions } from '../../interfaces';

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
    const now: Date = new Date();
    console.log(now);

    /*const statisticObj: IStatistics = {
      learnedWords: 0,
      optional: {
        stat: {
          stat: [
            {
              date: now,
              newWords: 1,
              games: {
                sprint: {
                  right: 3,
                  wrong: 11,
                  newWordsCountPerDay: 5,
                  learnedWordsCountPerDay: 4,
                  forgottenWordsCountPerDay: 3,
                  maxCorrectSeriesPerDay: 2,
                },
                audioCall: {
                  right: 1,
                  wrong: 1,
                  newWordsCountPerDay: 1,
                  learnedWordsCountPerDay: 1,
                  forgottenWordsCountPerDay: 1,
                  maxCorrectSeriesPerDay: 1,
                },
              },
            },
            {
              date: now,
              newWords: 2,
              games: {
                sprint: {
                  right: 3,
                  wrong: 11,
                  newWordsCountPerDay: 5,
                  learnedWordsCountPerDay: 4,
                  forgottenWordsCountPerDay: 3,
                  maxCorrectSeriesPerDay: 2,
                },
                audioCall: {
                  right: 1,
                  wrong: 1,
                  newWordsCountPerDay: 1,
                  learnedWordsCountPerDay: 1,
                  forgottenWordsCountPerDay: 1,
                  maxCorrectSeriesPerDay: 1,
                },
              },
            },
          ],
        },
      },
    };*/

    /*const arr: IStatistics[] = [];
    function computeObj(obj: IStatistics) {
      if (obj.optional?.next) {
        computeObj(obj.optional.next);
      }
    }*/

    await putUserStat(getUserId(), statisticObj);
    const stat = await getUserStat(getUserId());
    console.log(stat);
  });

  return page;
};
