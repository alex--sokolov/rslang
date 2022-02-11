import './Sprint.scss';
import { addElement, addTextElement, removeDisabled, setDisabled } from '../../utils/add-element';
import { Word, WordExtended } from '../../interfaces';
import { getRandom } from '../../utils/calc';
import { getUserAggregatedWords, getWords } from '../../components/api/api';
import { shuffledArray } from '../../utils/modify-arrays';
import { WordsList } from '../../types';

const TOTAL_PAGES_PER_GROUP = 30;
const WORDS_PER_PAGE = 20;

export const Sprint = async (params?: URLSearchParams): Promise<HTMLElement | void> => {

  localStorage.removeItem('SPRINT_INIT');


  //
  // console.log(params);
  // console.log(params?.get('group'));
  // console.log(params?.get('page'));
  // console.log(params?.get('fromDictionary'));

  // const gameStart = async (group: string, page: string) => {

  // const res = await updateTokens('6200fc9bf7ac1400169f2d52');
  // console.log(res);

  // const res = await getUserWords('6200fc9bf7ac1400169f2d52');
  // console.log(res);

  //   const res = await getUserAggregatedWords('6200fc9bf7ac1400169f2d52', '1', '25','','{"userWord.difficulty":"easy"}');
  //
  //   const wordsList = res?.wordsList;
  //   const totalWords = res?.totalWords;
  //   console.log(wordsList);
  //   console.log(totalWords);
  //
  //   const listen = async () => {
  //
  //   }
  //
  //   await listen();
  // }

  let isFromDictionary = false;
  const output = addElement('main', 'sprint-page') as HTMLElement;
  const pageTitle = addTextElement('h1', 'sprint-page-title', 'Sprint Page') as HTMLElement;
  const gameDescription = addElement('h2', 'sprint-description') as HTMLElement;
  gameDescription.insertAdjacentHTML('afterbegin',
    'Спринт - игра на скорость.<br> Цель - угадать как можно больше слов за 30 секунд.');
  const button = addTextElement('button', 'sprint-start-button', 'Начать') as HTMLButtonElement;

  let group = params?.get('group') || '';
  let page = params?.get('page') || '';
  const gameLevelAnnotation = (group && page)
    ? addTextElement('p', 'sprint-level-notes', 'Игра начнется с текущими словами из словаря')
    : addTextElement('p', 'sprint-level-notes', 'Выберите уровень');

  output.append(pageTitle, gameDescription);
  output.append(gameLevelAnnotation);
  let wordsList: WordsList;
  const userId = localStorage.getItem('id') as string;

  if (group && page) {
    if (!userId) wordsList = await getWords(page, group);
    else {
      isFromDictionary = true;
      const res = await getUserAggregatedWords(
        userId,
        undefined,
        undefined,
        '20',
        `{"$and":[{"$or":[{"userWord.difficulty":"easy"}, {"userWord.difficulty":"hard"}, {"userWord":null}]},
         {"group":${group}}, {"page":${page}}]}`);
      wordsList = res?.wordsList;
    }
    localStorage.setItem('SPRINT_INIT', JSON.stringify({ group, page, wordsList, isFromDictionary }));
  } else {
    const levelWrapper = addElement('div', 'sprint-levels');
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    levels.forEach((level, index) => {

      const levelEl = addTextElement('button', 'sprint-level', level) as HTMLButtonElement;

      levelEl.addEventListener('click', async () => {
        removeDisabled(button);
        const levelBtns = document.getElementsByClassName('sprint-level') as HTMLCollectionOf<HTMLButtonElement>;
        [...levelBtns].forEach((btn) => {
          if (btn.classList.contains('active')) btn.classList.remove('active');
          setDisabled(btn);
        });
        if (!levelEl.classList.contains('active')) levelEl.classList.add('active');

        page = `${getRandom(TOTAL_PAGES_PER_GROUP)}`;
        group = `${index}`;
        if (!userId) wordsList = await getWords(page, group);
        else {
          const res = await getUserAggregatedWords(
            userId,
            undefined,
            undefined,
            `${WORDS_PER_PAGE}`,
            `{"$and":[{"group":${group}}, {"page":${page}}]}`);
          wordsList = res?.wordsList;
        }
        localStorage.setItem('SPRINT_INIT', JSON.stringify({ group, page, wordsList, isFromDictionary }));
        [...levelBtns].forEach(btn => removeDisabled(btn));
      });

      levelWrapper.append(levelEl);
    });
    output.append(levelWrapper);
    setDisabled(button);
  }

  const addWordsForSprint = async (
    userId: string,
    group: number,
    page: number,
    isFromDictionary: boolean,
  ): Promise<WordsList> => {
    let wordsList: WordsList;
    if (page === 0) await finishSprint();
    if (!userId) wordsList = await getWords(`${page - 1}`, `${group}`);
    else {
      const filterQuery = isFromDictionary
        ? `{"$and":[{"$or":[{"userWord.difficulty":"easy"}, {"userWord.difficulty":"hard"}, {"userWord":null}]},
         {"group":${group}}, {"page":${page - 1}}]}`
        : `{"$and":[{"group":${group}}, {"page":${page - 1}}]}`;
      const res = await getUserAggregatedWords(userId, undefined, undefined,'20', filterQuery);
      wordsList = res?.wordsList;
    }
    if (!wordsList || wordsList?.length === 0)
      wordsList = await addWordsForSprint(userId, group, page-1, isFromDictionary);
    return wordsList;
  }

  const finishSprint = async () => {

  };

  const startSprint = async () => {
    const sprintInit = JSON.parse(localStorage.getItem('SPRINT_INIT') as string);
    const userId = localStorage.getItem('id') as string;
    const group = sprintInit.group;
    const page = sprintInit.page;
    let wordsList = sprintInit.wordsList;
    const isFromDictionary = sprintInit.isFromDictionary;

    pageTitle.classList.add('out-left');
    gameDescription.classList.add('out-right');
    gameLevelAnnotation.classList.add('out-left');
    button.classList.add('out-down');
    const levelBtns = document.getElementsByClassName('sprint-level') as HTMLCollectionOf<HTMLButtonElement>;
    [...levelBtns].forEach((level, index) => {
      if (level.classList.contains('active')) level.classList.add(`out-active`);
      else level.classList.add(`out-level-${index % 2}`);
    });

    while (wordsList.length === 0) {
      wordsList = await addWordsForSprint(userId, group, page, isFromDictionary);
    }
    shuffledArray(wordsList);

    const answersList: string[] = [];
    wordsList.forEach((word: Word | WordExtended) => {
      answersList.push(word.wordTranslate)
    })

    const getWrongAnswer = (right: string, answers: string[]) :string => {
      answers.splice(answers.indexOf(right), 1);
      return answers[getRandom(answersList.length)]
    }

    const question = wordsList[0].word;
    const rightAnswer = wordsList[0].wordTranslate;

    console.log(wordsList);
    console.log(answersList);
    const wrongAnswer = getWrongAnswer(rightAnswer, answersList);
    // console.log(wordsList.shift());
    // console.log(wordsList);
    console.log('Question: ', question, rightAnswer, wrongAnswer);
    showQuestion(question, rightAnswer, wrongAnswer);

  };
  const showQuestion = (question: string, rightAnswer: string, wrongAnswer: string) => {

  }


  button.addEventListener('click', startSprint);
  output.append(button);
  return output;
};
