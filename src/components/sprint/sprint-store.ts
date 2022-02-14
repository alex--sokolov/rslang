import { SprintGameSettings } from '../../interfaces';
import { getUserId } from '../../utils/local-storage-helpers';

export const game: SprintGameSettings = {
  userId: '',
  questionNumber: 0,
  score: 0,
  scoreMultiplier: 1,
  correctSequence: 0,
  maxCorrectSequence: 0,
  rightOrWrong: false,
  group: '',
  page: '',
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

export const initStore = (params?: URLSearchParams) => {
  game.userId = getUserId();
  game.group = params?.get('group') || '';
  game.page = params?.get('page') || '';
}
