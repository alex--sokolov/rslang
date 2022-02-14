import './Sprint.scss';
import { addElement, addTextElement, removeDisabled, setDisabled } from '../../utils/add-element';
import { getRandom } from '../../utils/calc';
import { shuffledArray } from '../../utils/modify-arrays';
import { game, initStore } from '../../components/sprint/sprint-store';
import { GAME_TIME, LEVELS, SCORE_ADDITION, TIMEOUT_BEFORE_START } from '../../components/sprint/sprint-vars';
import {
  addWordsForSprint, formCurrentWordResult,
  getWrongAnswer,
  initWordsListDictionary,
  initWordsListMenu, saveCurrentWordResult, showTimer, updateScore, updateSequence
} from '../../components/sprint/sprint';

export const Sprint = async (params?: URLSearchParams): Promise<HTMLElement | void> => {
  initStore(params);
  const output = addElement('main', 'sprint-page') as HTMLElement;
  const pageTitle = addTextElement('h1', 'sprint-page-title', 'Sprint Page') as HTMLElement;
  const gameDescription = addElement('h2', 'sprint-description') as HTMLElement;
  gameDescription.insertAdjacentHTML('afterbegin',
    'Спринт - игра на скорость.<br> Цель - угадать как можно больше слов за 30 секунд.');
  const gameLevelAnnotation = (game.group && game.page)
    ? addTextElement('p', 'sprint-level-notes', 'Игра начнется с текущими словами из словаря')
    : addTextElement('p', 'sprint-level-notes', 'Выберите уровень');
  const button = addTextElement('button', 'sprint-start-button', 'Начать') as HTMLButtonElement;
  output.append(pageTitle, gameDescription, gameLevelAnnotation);

  if (game.group && game.page) await initWordsListDictionary();
  else {
    const levelWrapper = addElement('div', 'sprint-levels');
    const createLevels = (level: string, index: number) => {
      const levelEl = addTextElement('button', 'sprint-level', level) as HTMLButtonElement;
      const chooseLevelHandler = async () => {
        const levelBtns = document.getElementsByClassName('sprint-level') as HTMLCollectionOf<HTMLButtonElement>;
        [...levelBtns].forEach(btn => {
          if (btn.classList.contains('active')) btn.classList.remove('active');
          setDisabled(btn);
        });
        if (!levelEl.classList.contains('active')) levelEl.classList.add('active');
        await initWordsListMenu(index);
        [...levelBtns].forEach(btn => removeDisabled(btn));
        removeDisabled(button);
      };

      levelEl.addEventListener('click', chooseLevelHandler);
      levelWrapper.append(levelEl);
    };
    LEVELS.forEach(createLevels);
    const keyHandlerStart = async (e: KeyboardEvent) => {
      document.removeEventListener('keydown', keyHandlerStart);
      if (e.key === 'Enter' && !button.disabled) await startSprint();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const levelBtns = document.getElementsByClassName('sprint-level') as HTMLCollectionOf<HTMLButtonElement>;
        let indexActive = -1;
        const indexLast = levelBtns.length - 1;
        [...levelBtns].forEach((btn, index) => {
          if (btn.classList.contains('active')) indexActive = index
        });
        if (indexActive === -1) indexActive = e.key === 'ArrowLeft' ? 0 : indexLast;
        else {
          levelBtns[indexActive].classList.remove('active');
          indexActive += e.key === 'ArrowLeft' ? -1 : 1;
          if (indexActive === -1) indexActive = indexLast;
          if (indexActive === indexLast + 1) indexActive = 0;
        }
        await initWordsListMenu(indexActive);
        levelBtns[indexActive].classList.add('active');
        if (button.disabled) removeDisabled(button);
        document.addEventListener('keydown', keyHandlerStart);
      }
    };
    document.addEventListener('keydown', keyHandlerStart);
    output.append(levelWrapper);
    setDisabled(button);
  }
  const startSprint = async (): Promise<void> => {
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
  const showQuestion = async (): Promise<void> => {
    const scoreContainer = addElement('div', 'sprint-score-container');
    const scoreField = addTextElement('div', 'sprint-score-text', 'Ваш Score — ');
    const scoreEl = addTextElement('div', 'sprint-score', `${game.score}`);
    const sequenceContainer = addElement('div', 'sprint-sequence-container') as HTMLDivElement;
    const levelContainer = addElement('div', 'sprint-levelInGame-container') as HTMLDivElement;
    const levelField = addTextElement('div', 'sprint-levelInGame-text', 'Level -') as HTMLDivElement;
    const levelEl = addTextElement('div', 'sprint-levelInGame', `${game.scoreMultiplier}`) as HTMLDivElement;
    const scoreLevelEl = addTextElement('div', 'sprint-score-level',
      `(+${game.scoreMultiplier * SCORE_ADDITION})`) as HTMLDivElement;
    const questionContainer = addElement('div', 'sprint-question-container') as HTMLElement;
    const btnsAnswersContainer = addElement('div', 'btns-answers-container') as HTMLElement;
    const btnYes = addTextElement('button', 'btn-yes', 'Верно') as HTMLButtonElement;
    const btnNo = addTextElement('button', 'btn-no', 'Неверно') as HTMLButtonElement;
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') nextQuestion(false);
      if (e.key === 'ArrowRight') nextQuestion(true);
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
      document.addEventListener('keydown', keyHandler);
    };
    const nextQuestion = async (userAnswer: boolean) => {
      document.removeEventListener('keydown', keyHandler);
      setDisabled(btnNo);
      setDisabled(btnYes);
      questionContainer.innerHTML = '';
      const correct = userAnswer === game.rightOrWrong;
      if (correct) {
        updateScore(scoreEl);
        updateSequence(true, sequenceContainer, levelEl, scoreLevelEl);
      } else updateSequence(false, sequenceContainer, levelEl, scoreLevelEl);
      formCurrentWordResult(correct);
      if (game.userId) await saveCurrentWordResult();
      if (game.wordsList.length === 1) game.wordsList = await addWordsForSprint();
      else game.wordsList.shift();
      changeQuestion();
      removeDisabled(btnNo);
      removeDisabled(btnYes);
    };

    scoreContainer.append(scoreField, scoreEl);
    levelContainer.append(levelField, levelEl, scoreLevelEl);
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
  button.addEventListener('click', startSprint);
  output.append(button);
  return output;
};
