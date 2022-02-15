import { game } from './sprint-store';
import { getRandom } from '../../utils/calc';
import {
  EASY_SERIES,
  HARD_SERIES,
  MULT_INC_TRIGGER,
  MULT_INC_TRIGGER_STEP,
  SCORE_ADDITION,
  TOTAL_PAGES_PER_GROUP,
  WORDS_PER_PAGE
} from './sprint-vars';
import { createUserWord, getUserAggregatedWords, getWords, updateUserWord } from '../api/api';
import { addElement, addTextElement } from '../../utils/add-element';
import { WordsList } from '../../types';
import { shuffledArray } from '../../utils/modify-arrays';
import { UserWord } from '../../interfaces';
import { audioPlay } from './sprint-sounds';
import { showModal } from '../../utils/show-modal';

export const initWordsListDictionary = async () => {
  if (!game.userId) game.wordsList = await getWords(game.group, game.page);
  else {
    game.isFromDictionary = true;
    const res = await getUserAggregatedWords(
      game.userId,
      undefined,
      undefined,
      `${WORDS_PER_PAGE}`,
      `{"$and":[{"$or":[{"userWord.difficulty":"easy"}, {"userWord.difficulty":"hard"}, {"userWord":null}]},
         {"group":${game.group}}, {"page":${game.page}}]}`);
    game.wordsList = res ? res.wordsList : [];
  }
};
export const initWordsListMenu = async (group: number) => {
  console.log('init1');
  game.page = `${getRandom(TOTAL_PAGES_PER_GROUP)}`;
  game.group = `${group}`;
  console.log('init2');
  if (!game.userId) game.wordsList = await getWords(game.group, game.page);
  else {
    const res = await getUserAggregatedWords(
      game.userId,
      undefined,
      undefined,
      `${WORDS_PER_PAGE}`,
      `{"$and":[{"group":${game.group}}, {"page":${game.page}}]}`);
    game.wordsList = res ? res.wordsList : [];
  }
  console.log('init3');
};
export const getWrongAnswer = (right: string, answersList: string[]): string => {
  const answers = [...answersList];
  answers.splice(answers.indexOf(right), 1);
  return answers[getRandom(answers.length)];
};

export const finishSprint = async (): Promise<void> => {
  const finalContainer = addElement('div', 'sprint-final');
  showModal(finalContainer);
  clearInterval(game.timerInterval);
  game.music?.pause();
  await audioPlay('Finish');

};
export const addWordsForSprint = async (): Promise<WordsList> => {
  let wordsList: WordsList;
  if (+game.page === 0) {
    await finishSprint();
    wordsList = [];
  }
  else {
    if (!game.userId) {
      wordsList = await getWords(`${game.group}`, `${+game.page - 1}`);
    } else {
      const filterQuery = game.isFromDictionary
        ? `{"$and":[{"$or":[{"userWord.difficulty":"easy"}, {"userWord.difficulty":"hard"}, {"userWord":null}]},
         {"group":${game.group}}, {"page":${+game.page - 1}}]}`
        : `{"$and":[{"group":${game.group}}, {"page":${+game.page - 1}}]}`;
      const res = await getUserAggregatedWords(game.userId, undefined, undefined, `${WORDS_PER_PAGE}`, filterQuery);
      wordsList = res ? res.wordsList : [];
    }
    if (wordsList.length === 0) {
      game.page = `${+game.page - 1}`;
      wordsList = await addWordsForSprint();
    }
    shuffledArray(wordsList);
    game.answersList = [];
    wordsList.forEach(word => game.answersList.push(word.wordTranslate));
  }
  return wordsList;
};
export const showTimer = (seconds: number): HTMLElement => {
  const timer = addTextElement('h2', 'timer', `${seconds}`) as HTMLElement;
  game.timerInterval = window.setInterval(() => {
    if (seconds < 0) {
      timer.textContent = '';
      const timeIsUp = addTextElement('h2', 'time-is-up', 'Время вышло') as HTMLElement;
      timer.append(timeIsUp);
      finishSprint();
    } else {
      timer.textContent = `${seconds}`;
      --seconds;
    }
  }, 1000);
  return timer;
};
export const updateScore = (scoreElement: HTMLElement) => {
  game.score += SCORE_ADDITION * game.scoreMultiplier;
  scoreElement.textContent = `${game.score}`;
};
export const updateSequence = async (
  correctAnswer: boolean,
  sequenceContainer: HTMLDivElement,
  levelElement: HTMLDivElement,
  scoreLevelElement: HTMLDivElement
) => {
  const sequenceCollection =
    sequenceContainer.getElementsByClassName('sprint-star') as HTMLCollectionOf<HTMLElement>;

  if (correctAnswer) {
    game.correctSequence++;
    game.maxCorrectSequence = Math.max(game.maxCorrectSequence, game.correctSequence);
    sequenceContainer.append(addElement('div', 'sprint-star'));
    if (game.correctSequence - (MULT_INC_TRIGGER_STEP * (game.scoreMultiplier - 1)) === MULT_INC_TRIGGER) {
      await audioPlay('LevelUp');
      [...sequenceCollection].forEach(star => {
        setTimeout(() => {
          star.classList.add('sprint-mult-increase');
        }, 250);
        setTimeout(() => {
          star.classList.remove('sprint-mult-increase');
        }, 750);
      });
      game.scoreMultiplier += 1;
      levelElement.textContent = `${game.scoreMultiplier}`;
      scoreLevelElement.textContent = `(+${game.scoreMultiplier * SCORE_ADDITION})`;
    }
  } else {
    if ([...sequenceCollection].length > 3) await audioPlay('LevelLost');
    else await audioPlay('WrongAnswer');
    game.maxCorrectSequence = Math.max(game.maxCorrectSequence, game.correctSequence);
    game.correctSequence = 0;
    game.scoreMultiplier = 1;
    levelElement.textContent = `${game.scoreMultiplier}`;
    scoreLevelElement.textContent = `(+${game.scoreMultiplier * SCORE_ADDITION})`;
    [...sequenceCollection].forEach((star, index) => {
      setTimeout(() => star.classList.add('sprint-mult-delete'), 250 - index * 10);
      setTimeout(() => star.remove(), 500);
    });
  }
};

export const formCurrentWordResult = (correct: boolean) => {
  game.userAnswers.push(correct);
  game.wordsListPlayed.push(game.wordsList[0]);
  if (game.userId) {
    const curIndex = game.wordsListPlayed.length - 1;
    game.isUserWord = !!game.wordsListPlayed[curIndex].userWord;
    let userWordPlayed = game.wordsListPlayed[curIndex].userWord || {};

    if (!userWordPlayed.optional) {
      userWordPlayed.optional = {
        addTime: Date.now(),
        new: true,
        games: {
          sprint: {
            right: 0,
            wrong: 0
          }
        }
      };
    }
    if (!userWordPlayed.optional.addTime) userWordPlayed.optional.addTime = Date.now();
    userWordPlayed.optional.new = Date.now() - userWordPlayed.optional.addTime < 24 * 60 * 60 * 1000;

    const games = userWordPlayed.optional.games || {
      sprint: {
        right: 0,
        wrong: 0
      },
      correctAnswerSeries: 0
    };
    const sprint = games.sprint || {
      right: 0,
      wrong: 0
    };
    if (correct) sprint.right += 1;
    else sprint.wrong += 1;

    if (games.correctAnswerSeries) games.correctAnswerSeries = correct ? games.correctAnswerSeries + 1 : 0;
    else games.correctAnswerSeries = correct ? 1 : 0;

    switch (userWordPlayed.difficulty) {
      case 'learned':
        if (!correct) userWordPlayed.difficulty = 'hard';
        break;
      case 'hard':
        if (games.correctAnswerSeries === HARD_SERIES) userWordPlayed.difficulty = 'learned';
        break;
      case 'easy':
        if (games.correctAnswerSeries === EASY_SERIES) userWordPlayed.difficulty = 'learned';
        break;
      default:
        userWordPlayed.difficulty = 'easy';
    }
    game.wordsListPlayed[curIndex].userWord = userWordPlayed;
  }
};
export const saveCurrentWordResult = async () => {
  const id = game.wordsListPlayed[game.wordsListPlayed.length - 1]._id as string;
  const word = game.wordsListPlayed[game.wordsListPlayed.length - 1].userWord as UserWord;
  if (game.isUserWord) await updateUserWord(game.userId, id, word);
  else await createUserWord(game.userId, id, word);
};

