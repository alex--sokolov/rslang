import './Sprint.scss';
import { addElement, addTextElement, removeDisabled, setDisabled } from '../../utils/add-element';
import { SprintGameSettings, UserWord, Word, WordExtended } from '../../interfaces';
import { getRandom } from '../../utils/calc';
import {
  createUserWord,
  getUserAggregatedWords,
  getUserWord,
  getWords,
  updateUserWord
} from '../../components/api/api';
import { shuffledArray } from '../../utils/modify-arrays';
import { WordsList } from '../../types';
import { getUserId } from '../../utils/local-storage-helpers';

const TOTAL_PAGES_PER_GROUP = 30;
const WORDS_PER_PAGE = 20;
const GAME_TIME = 30;
const TIMEOUT_BEFORE_START = 2000;
const SCORE_ADDITION = 10;
const MULT_INC_TRIGGER = 4;
const MULT_INC_TRIGGER_STEP = 3;

export const Sprint = async (params?: URLSearchParams): Promise<HTMLElement | void> => {

    const game: SprintGameSettings = {
      userId: getUserId(),
      questionNumber: 0,
      score: 0,
      scoreMultiplier: 1,
      correctSequence: 0,
      maxCorrectSequence: 0,
      rightOrWrong: false,
      group: params?.get('group') || '',
      page: params?.get('page') || '',
      isFromDictionary: false,
      wordsList: [],
      wordsListPlayed: [],
      isUserWord: false,
      answersList: [],
      question: '',
      rightAnswer: '',
      wrongAnswer: '',
      userAnswers: [],
      timerInterval: 0,
    };

    const output = addElement('main', 'sprint-page') as HTMLElement;
    const pageTitle = addTextElement('h1', 'sprint-page-title', 'Sprint Page') as HTMLElement;
    const gameDescription = addElement('h2', 'sprint-description') as HTMLElement;
    gameDescription.insertAdjacentHTML('afterbegin',
      'Спринт - игра на скорость.<br> Цель - угадать как можно больше слов за 30 секунд.');
    const button = addTextElement('button', 'sprint-start-button', 'Начать') as HTMLButtonElement;

    const gameLevelAnnotation = (game.group && game.page)
      ? addTextElement('p', 'sprint-level-notes', 'Игра начнется с текущими словами из словаря')
      : addTextElement('p', 'sprint-level-notes', 'Выберите уровень');

    output.append(pageTitle, gameDescription);
    output.append(gameLevelAnnotation);
    let wordsList: WordsList;

    if (game.group && game.page) {
      if (!game.userId) wordsList = await getWords(game.group, game.page);
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
    } else {
      const levelWrapper = addElement('div', 'sprint-levels');
      const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      levels.forEach((level, index) => {
        const levelEl = addTextElement('button', 'sprint-level', level) as HTMLButtonElement;
        levelEl.addEventListener('click', async () => {
          const levelBtns = document.getElementsByClassName('sprint-level') as HTMLCollectionOf<HTMLButtonElement>;
          [...levelBtns].forEach(btn => {
            if (btn.classList.contains('active')) btn.classList.remove('active');
            setDisabled(btn);
          });
          if (!levelEl.classList.contains('active')) levelEl.classList.add('active');

          game.page = `${getRandom(TOTAL_PAGES_PER_GROUP)}`;
          game.group = `${index}`;
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
          [...levelBtns].forEach(btn => removeDisabled(btn));
          removeDisabled(button);
        });
        levelWrapper.append(levelEl);
      });
      output.append(levelWrapper);
      setDisabled(button);
    }

    const addWordsForSprint = async (): Promise<WordsList> => {
      let wordsList: WordsList;
      if (+game.page === 0) await finishSprint();
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
      return wordsList;
    };
    const startSprint = async () => {
      console.log('start');
      pageTitle.classList.add('out-left');
      gameDescription.classList.add('out-right');
      gameLevelAnnotation.classList.add('out-left');
      button.classList.add('out-down');
      const levelBtns = document.getElementsByClassName('sprint-level') as HTMLCollectionOf<HTMLButtonElement>;
      [...levelBtns].forEach((level, index) => {
        if (level.classList.contains('active')) level.classList.add(`out-active`);
        else level.classList.add(`out-level-${index % 2}`);
      });
      if (game.wordsList.length === 0) game.wordsList = await addWordsForSprint();
      else {
        shuffledArray(game.wordsList);
        game.wordsList.forEach(word => game.answersList.push(word.wordTranslate));
      }
      setTimeout(async () => {
        await showQuestion();
      }, TIMEOUT_BEFORE_START);
    };
    const showTimer = (seconds: number): HTMLElement => {
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
      console.log('Interval');
      console.log(game.timerInterval);
      return timer;
    };
    const getWrongAnswer = (right: string, answersList: string[]): string => {
      // console.log('getWrong:');
      // console.log('- - -- - -- - -- -- ------------------ - - -- - ');
      // console.log(right, answersList);
      const answers = [...answersList];
      // console.log(answers.indexOf(right));
      answers.splice(answers.indexOf(right), 1);
      // console.log(answers);
      // console.log('- - -- - -- - -- -- ------------------ - - -- - ');
      return answers[getRandom(answers.length)];
    };
    const showQuestion = async () => {
      const scoreContainer = addElement('div', 'sprint-score-container');
      const scoreField = addTextElement('div', 'sprint-score-text', 'Ваш Score — ');
      const scoreEl = addTextElement('div', 'sprint-score', `${game.score}`);
      scoreContainer.append(scoreField, scoreEl);

      const sequenceContainer = addElement('div', 'sprint-sequence-container');

      const levelContainer = addElement('div', 'sprint-levelInGame-container');
      const levelField = addTextElement('div', 'sprint-levelInGame-text', 'Level -');
      const levelEl = addTextElement('div', 'sprint-levelInGame', `${game.scoreMultiplier}`);
      const scoreLevelEl = addTextElement('div', 'sprint-score-level',
        `(+${game.scoreMultiplier * SCORE_ADDITION})`);
      levelContainer.append(levelField, levelEl, scoreLevelEl);

      const questionContainer = addElement('div', 'sprint-question-container') as HTMLElement;
      const btnsAnswersContainer = addElement('div', 'btns-answers-container') as HTMLElement;
      const btnYes = addTextElement('button', 'btn-yes', 'Верно') as HTMLButtonElement;
      const btnNo = addTextElement('button', 'btn-no', 'Неверно') as HTMLButtonElement;

      const updateScore = () => {
        game.score += SCORE_ADDITION * game.scoreMultiplier;
        scoreEl.textContent = `${game.score}`;
      };

      const updateSequence = (correctAnswer: boolean) => {
        const sequenceCollection =
          sequenceContainer.getElementsByClassName('sprint-star') as HTMLCollectionOf<HTMLElement>;

        if (correctAnswer) {
          game.correctSequence++;
          game.maxCorrectSequence = Math.max(game.maxCorrectSequence, game.correctSequence);
          sequenceContainer.append(addElement('div', 'sprint-star'));
          if (game.correctSequence - (MULT_INC_TRIGGER_STEP * (game.scoreMultiplier - 1)) === MULT_INC_TRIGGER) {
            [...sequenceCollection].forEach(star => {
              setTimeout(() => {
                star.classList.add('sprint-mult-increase');
              }, 250);
              setTimeout(() => {
                star.classList.remove('sprint-mult-increase');
              }, 750);
            });
            game.scoreMultiplier += 1;
            levelEl.textContent = `${game.scoreMultiplier}`;
            scoreLevelEl.textContent = `(+${game.scoreMultiplier * SCORE_ADDITION})`;
          }
        } else {
          game.maxCorrectSequence = Math.max(game.maxCorrectSequence, game.correctSequence);
          game.correctSequence = 0;
          game.scoreMultiplier = 1;
          levelEl.textContent = `${game.scoreMultiplier}`;
          scoreLevelEl.textContent = `(+${game.scoreMultiplier * SCORE_ADDITION})`;
          [...sequenceCollection].forEach((star, index) => {
            setTimeout(() => {
              star.classList.add('sprint-mult-delete');
            }, 250 - index * 10);
            setTimeout(() => {
              star.remove();
            }, 500);
          });
        }
      };

      const changeQuestion = () => {
        game.question = game.wordsList[0].word;
        game.rightAnswer = game.wordsList[0].wordTranslate;
        game.wrongAnswer = getWrongAnswer(game.rightAnswer, game.answersList);
        console.log(game.wordsList);
        console.log(game.answersList);
        console.log('Question: ', game.question, game.rightAnswer, game.wrongAnswer);

        const questionEl = addTextElement('div', 'sprint-question', `${game.question}`) as HTMLElement;
        const equality = addTextElement('div', 'sprint-question-equality', ` это `) as HTMLElement;
        const answerEl = addElement('div', 'sprint-question-answer') as HTMLElement;
        const questionMark = addTextElement('div', 'sprint-question-mark', '?') as HTMLElement;
        game.rightOrWrong = Boolean(getRandom(2));
        answerEl.textContent = game.rightOrWrong ? game.rightAnswer : game.wrongAnswer;
        questionContainer.append(questionEl, equality, answerEl, questionMark);
      };

      const saveCurrentWordResult = async () => {
        const id = game.wordsListPlayed[game.wordsListPlayed.length - 1]._id as string;
        const word = game.wordsListPlayed[game.wordsListPlayed.length - 1].userWord as UserWord;

        console.log('SAVING TO DB');
        console.log(' - - - -- - - ');
        if (game.isUserWord) {
           const res = await updateUserWord(game.userId, id, word);
          console.log(res);
        } else {
           const res = await createUserWord(game.userId, id, word);
          console.log(res);
        }
        console.log(' - - - -- - - ');
      };

      const formCurrentWordResult = (correct: boolean) => {
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

          userWordPlayed.optional.new = Date.now() - userWordPlayed.optional.addTime < 24 * 60 * 60 * 1000;

          const games = userWordPlayed.optional.games || {
            sprint: {
              right: 0,
              wrong: 0,
            },
            correctAnswerSeries: 0,
          };
          const sprint = games.sprint || {
            right: 0,
            wrong: 0,
          }
          if (correct) sprint.right += 1;
          else sprint.wrong += 1;

          if (games.correctAnswerSeries) games.correctAnswerSeries = correct ? games.correctAnswerSeries + 1 : 0;
          else games.correctAnswerSeries = correct ? 1 : 0;

          switch (userWordPlayed.difficulty) {
            case 'learned':
              if (!correct) userWordPlayed.difficulty = 'hard';
              break;
            case 'hard':
              if (games.correctAnswerSeries === 5) userWordPlayed.difficulty = 'learned';
              break;
            case 'easy':
              if (games.correctAnswerSeries === 3) userWordPlayed.difficulty = 'learned';
              break;
            default:
              userWordPlayed.difficulty = 'easy';
          }
          game.wordsListPlayed[curIndex].userWord = userWordPlayed;
        }
      };

      const nextQuestion = async (userAnswer: boolean) => {
        setDisabled(btnNo);
        setDisabled(btnYes);
        questionContainer.innerHTML = '';
        const correct = userAnswer === game.rightOrWrong ? true : false;

        if (correct) {
          await updateScore();
          await updateSequence(true);
          console.log('correct');
        } else {
          await updateSequence(false);
        }


        console.log("userId: ", game.userId);
        console.log("max correct sequence", game.maxCorrectSequence);
        // Save results for current word

        formCurrentWordResult(correct);
        if (game.userId) saveCurrentWordResult();
        console.log('SAVING');
        console.log('- - - - - - - - - - -');
        console.log(game.wordsListPlayed);
        console.log(game.userAnswers);
        console.log('- - - - - - - - - - -');
        if (game.wordsList.length === 1) game.wordsList = await addWordsForSprint();
        else game.wordsList.shift();
        console.log('AfterShift');
        console.log('- - - - - - - - - - -');
        console.log(game.wordsList);
        console.log(game.wordsListPlayed);
        console.log('- - - - - - - - - - -');
        changeQuestion();

        removeDisabled(btnNo);
        removeDisabled(btnYes);
      };

      changeQuestion();
      btnNo.addEventListener('click', nextQuestion.bind(null, false));
      btnYes.addEventListener('click', nextQuestion.bind(null, true));
      btnsAnswersContainer.append(btnNo, btnYes);
      output.innerHTML = '';
      output.append(
        showTimer(GAME_TIME),
        scoreContainer,
        sequenceContainer,
        levelContainer,
        questionContainer,
        btnsAnswersContainer);
    };
    const finishSprint = async () => {
      clearInterval(game.timerInterval);

    };

    button.addEventListener('click', startSprint);
    output.append(button);
    return output;
  }
;
