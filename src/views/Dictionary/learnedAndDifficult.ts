import { getUserWords, getUserWord, createUserWord, updateUserWord, deleteUserWord } from '../../components/api/api';
import { getUserAggregatedWords } from '../../components/api/api';
import { getUserId } from '../../utils/local-storage-helpers';
import { UserWord } from '../../interfaces';

const userId = getUserId();

export function lestenStateBtns(e: Event, wordId: string, wordState: UserWord) {
  const targetState = wordState.difficulty as string;
  const btnElement = e.currentTarget as HTMLButtonElement;
  const cardElement = btnElement.parentElement?.parentElement?.parentElement as HTMLDivElement;

  const isHardActive = cardElement.classList.contains('hard') && targetState === 'hard';
  const isLearnedActive = cardElement.classList.contains('learned') && targetState === 'learned';
  const wordListElement = document.querySelector(`.word-item_active`) as HTMLButtonElement;

  wordListElement.classList.remove('word-item_hard', 'word-item_learned', 'word-item_easy');
  cardElement.classList.remove('learned', 'hard');

  function createWord() {
    // console.log('create word');
    // console.log(userId, wordId, wordState);
    createUserWord(userId, wordId, wordState);
  }

  function updateWord() {
    // console.log('update word');
    updateUserWord(userId, wordId, wordState);
    // console.log(getUserWords(userId));
  }

  function setDefaultWordState() {
    // console.log('update word default');
    updateUserWord(userId, wordId, { difficulty: 'easy' });
  }

  if (isHardActive || isLearnedActive) {
    setDefaultWordState();
  } else {
    const isWordAlreadyAdded = getUserWord(userId, wordId);
    isWordAlreadyAdded.then(updateWord, createWord);
    cardElement.classList.toggle(targetState);
    wordListElement.classList.add(`word-item_${targetState}`);
  }

}
