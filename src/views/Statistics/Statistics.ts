import { addElement, addTextElement } from '../../utils/add-element';
import { getUserStat } from '../../components/api/api';
import { getUserId } from '../../utils/local-storage-helpers';
import { DAY_24H } from '../../components/sprint/sprint-vars';
import './Statistics.scss';


export const Statistics = async (): Promise<HTMLElement | void> => {
  const output = addElement('main', 'statistics-page', 'statistics-page') as HTMLElement;
  const userId = getUserId();
  const stats = await getUserStat(userId);
  console.log(stats);


  if (!stats) {
    const noStats = addTextElement('div', 'no-stats',
      'К сожалению, в настоящий момент статистика недоступна.');
    output.append(noStats);
  } else {
    const stat = stats.optional.stat.stat[stats.optional.stat.stat.length - 1];
    const date = new Date(stat.date);
    if (Date.now() - date.getTime() > DAY_24H) {
      const noStatsDay = addTextElement('div', 'no-stats',
        'К сожалению, за последние сутки Вы не принимали участие в играх');
      output.append(noStatsDay);
    } else {

      const statTitle = addTextElement('div', 'stats-title',
        'Статистика за последние 24 часа');
      const gamesStatsTitle = addTextElement('div', 'games-stats-title',
        'Cтатистикa по мини-играм: ');
      const gamesStats = addElement('div', 'games-stats', 'games-stats');

      const wordsStatsTitle = addTextElement('div', 'words-stats-title',
        'Cтатистикa по словам: ');
      const wordsStats = addElement('div', 'words-stats', 'words-stats');

      const getGamesStat = () => {
        let sprintPercent = stat.games.sprint.right * 100 / (stat.games.sprint.right + stat.games.sprint.wrong);
        sprintPercent = isNaN(sprintPercent) ? 0 : +sprintPercent.toFixed(2);
        let audioCallPercent = stat.games.audioCall.right * 100 / stat.games.audioCall.right
          + stat.games.audioCall.wrong;
        audioCallPercent = isNaN(audioCallPercent) ? 0 : +audioCallPercent.toFixed(2);

        const template = `
      <div class="games-stats-fields">
        <div class="stat-field"></div>
        <div class="stat-field">количество новых слов за день</div>
        <div class="stat-field">процент правильных ответов</div>
        <div class="stat-field">самая длинная серия правильных ответов</div>
      </div>
      <div class="sprint-stats">
        <div class="sprint-stats-title">Спринт</div>
        <div class="stat-field-value">${stat.games.sprint.newWordsCountPerDay}</div>
        <div class="stat-field-value">${sprintPercent}</div>
        <div class="stat-field-value">${stat.games.sprint.maxCorrectSeriesPerDay}</div>
      </div>
      <div class="audioCall-stats">
        <div class="audioCall-stats-title">Аудиовызов</div>
        <div class="stat-field-value">${stat.games.audioCall.newWordsCountPerDay}</div>
        <div class="stat-field-value">${audioCallPercent}</div>
        <div class="stat-field-value">${stat.games.audioCall.maxCorrectSeriesPerDay}</div>
      </div>`;
        return template;
      };

      const newWords = stat.games.sprint.newWordsCountPerDay + stat.games.audioCall.newWordsCountPerDay;
      const learnedWords = stat.games.sprint.learnedWordsCountPerDay + stat.games.audioCall.learnedWordsCountPerDay;
      const forgotten = stat.games.sprint.forgottenWordsCountPerDay + stat.games.audioCall.forgottenWordsCountPerDay;
      const totalRight = stat.games.sprint.right + stat.games.audioCall.right;
      const totalWrong = stat.games.sprint.wrong + stat.games.audioCall.wrong;
      const total = totalRight + totalWrong;
      let percent = totalRight / total * 100;
      percent = isNaN(percent) ? 0 : +percent.toFixed(2);
      const percentEl = addElement('div', 'global');
      percentEl.setAttribute('data-pie', `{ "percent": ${percent} }`);
      const percentContainer = addTextElement('div', 'stat-percent',
        'Процент правильных ответов за день');
      percentContainer.append(percentEl);

      const getWordsStat = () => {
        const template = `
      <div class="words-stats-fields">
        <div class="stat-field">количество новых слов за день</div>
        <div class="stat-field">количество изученных слов за день</div>
        <div class="stat-field">количество забытых слов за день<br>
        (потерявших статус "изученное")</div>
      </div>
      <div class="sprint-stats">
        <div class="stat-field-value">${newWords}</div>
        <div class="stat-field-value">${learnedWords}</div>
        <div class="stat-field-value">${forgotten}</div>
      </div>`;
        return template;
      };

      gamesStats.innerHTML = getGamesStat();
      wordsStats.innerHTML = getWordsStat();
      output.append(statTitle, gamesStatsTitle, gamesStats, percentContainer, wordsStatsTitle,  wordsStats);

      setTimeout(() => {
      const globalConfig = {
        'lineargradient': ['#ff0000', '#705f58'],
        'round': true,
        'colorCircle': '#e6e6e6',
        'speed': 24
      };
      const global = new CircularProgressBar('global', globalConfig);
      global.initial();
      }, 1500);
    }
  }
  return output;
};
