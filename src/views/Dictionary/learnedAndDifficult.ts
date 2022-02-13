import { getUserWords, getUserWord, createUserWord, updateUserWord, deleteUserWord } from '../../components/api/api';
import { getUserAggregatedWords } from '../../components/api/api';
import { getUserId } from '../../utils/local-storage-helpers';
import { UserWord } from '../../interfaces';

const userId = getUserId();

export function lestenCheckboxes(e: Event, wordId: string, wordState: UserWord) {
  const targetState = wordState.difficulty;
  const radioElement = e.currentTarget as HTMLButtonElement;
  const cardElement = radioElement.parentElement?.parentElement?.parentElement as HTMLDivElement;

  const isHardActive = cardElement.classList.contains('hard') && targetState === 'hard';
  const isLearnedActive = cardElement.classList.contains('learned') && targetState === 'learned';


  function createWord() {
    console.log('create word');
    createUserWord(userId, wordId, wordState);
  }

  function updateWord() {
    console.log('update word');
    updateUserWord(userId, wordId, wordState);
    console.log(getUserWords(userId));
  }

  function setDefaultWordState() {
    console.log('update word default');
    updateUserWord(userId, wordId, { difficulty: 'easy' });
    cardElement.classList.toggle(targetState);
  }

  if (isHardActive || isLearnedActive) {
    setDefaultWordState();
  } else {
    const isWordAlreadyAdded = getUserWord(userId, wordId);
    isWordAlreadyAdded.then(updateWord, createWord);
    cardElement.classList.remove('learned', 'hard');
    cardElement.classList.toggle(targetState);
  }
}
