import {
  aggregatedWordsResponse,
  FetchParam,
  PostUser,
  ResponseUser,
  SignInParam,
  Tokens, UserWord, UserWordWithIds,
  Word
} from '../../interfaces';
import { getToken, setTokens } from '../../utils/local-storage-helpers';
import { openAuthModal } from '../authorization/authorization';

export const baseUrl = 'https://rs-lang-app-server.herokuapp.com/';

//TEXTBOOK
export const getWords = async (page: string, group: string): Promise<Array<Word>> => {
  const response: Response = await fetch(`${baseUrl}words?group=${group}&page=${page}`);
  return await response.json();
};
export const getWordById = async (id: string): Promise<Word> => {
  const response: Response = await fetch(`${baseUrl}words/${id}`);
  return await response.json();
};

// USERS

//REGISTRATION NEW USER
export const createUser = async (user: PostUser): Promise<Response> => {
  return await fetch(`${baseUrl}users`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
};

//LOG IN - returns standard response for next status check
export const signInApi = async (form: SignInParam): Promise<Response> => {
  const param = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  };
  return await fetch(`${baseUrl}signin`, param);
};

//returns boolean value for check successfully updating
export const updateTokens = async (userId: string): Promise<boolean> => {
  const response = await fetch(`${baseUrl}users/${userId}/tokens`);
  if (response.ok) {
    response.json().then((resp: Tokens) => {
      setTokens(resp);
    });
  }
  return response.ok;
};

// if status===401 we need update tokens
export const getUserById = async (userId: string): Promise<Response> => {
  const param = {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  };
  return await fetch(`${baseUrl}users/${userId}`, param);
};

export const putUser = async (userId: string, form: SignInParam): Promise<Response> => {
  const param = {
    method: 'PUT',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: form.email, password: form.password }),
  };
  return await fetch(`${baseUrl}users/${userId}`, param);
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  const param = {
    method: 'DELETE',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken('main')}`,
      Accept: '*/*',
    },
  };
  const response = await fetch(`${baseUrl}users/${userId}`, param);
  return response.ok;
};

/* ------------- USERS/WORDS -------------- */

export const getUserWords = async (userId: string): Promise<UserWordWithIds | void> => {
  const param = {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  };
  const response: Response = await fetch(`${baseUrl}users/${userId}/words`, param);
  switch (response.status) {
    case 200:
      const res = await response.json();
      return res;
    case 401:
      const status = await updateTokens(userId);
      if (status) return await getUserWords(userId);
      else openAuthModal();
      break;
    default:
      throw new Error('Something went wrong');
  }
};

export const createUserWord = async (userId: string, wordId: string, word: UserWord): Promise<Response | void> => {
  const response: Response = await fetch(`${baseUrl}users/${userId}/words/${wordId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(word),
  });
  switch (response.status) {
    case 200:
      return response;
    case 401:
      const status = await updateTokens(userId);
      if (status) return await createUserWord(userId, wordId, word);
      else openAuthModal();
      break;
    default:
      throw new Error('Something went wrong');
  }
};

export const getUserWord = async (userId: string, wordId: string): Promise<UserWordWithIds | void> => {
  const param = {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  };
  const response: Response = await fetch(`${baseUrl}users/${userId}/words/${wordId}`, param);
  switch (response.status) {
    case 200:
      const res = await response.json();
      return res;
    case 401:
      const status = await updateTokens(userId);
      if (status) return await getUserWord(userId, wordId);
      else openAuthModal();
      break;
    default:
      throw new Error('Something went wrong');
  }
};

export const updateUserWord = async (userId: string, wordId: string, word: UserWord): Promise<Response | void> => {
  const param = {
    method: 'PUT',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(word),
  };
  const response: Response = await fetch(`${baseUrl}users/${userId}/words/${wordId}`, param);
  switch (response.status) {
    case 200:
      return response;
    case 401:
      const status = await updateTokens(userId);
      if (status) return await updateUserWord(userId, wordId, word);
      else openAuthModal();
      break;
    default:
      throw new Error('Something went wrong');
  }
};

export const deleteUserWord = async (userId: string, wordId: string): Promise<Response | void> => {
  const param = {
    method: 'DELETE',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken('main')}`,
      Accept: '*/*',
    },
  };
  const response: Response = await fetch(`${baseUrl}users/${userId}/words/${wordId}`, param);
  switch (response.status) {
    case 200:
      return response;
    case 401:
      const status = await updateTokens(userId);
      if (status) return await deleteUserWord(userId, wordId);
      else openAuthModal();
      break;
    default:
      throw new Error('Something went wrong');
  }
};

/* ------------- Users/AggregatedWords -------------- */
// Example for field filter:
// {"$and":[{"group":1}, {"page":25}, {"userWord.difficulty":"easy"}]}
// {"$or":[{"$and":[{"userWord.difficulty":"easy", "userWord.optional.new":true}]},{"userWord":null}]}
export const getUserAggregatedWords = async (
  userId: string,
  group?: string,
  page?: string,
  wordsPerPage?: string,
  filter?: string
): Promise<aggregatedWordsResponse | void> => {
  let params = [];
  if (group) params.push(`group=${group}`);
  if (page && !filter) params.push(`page=${page}`);
  if (wordsPerPage) params.push(`wordsPerPage=${wordsPerPage}`);
  if (filter) params.push(`filter=${filter}`);
  let filterQuery: string = params.join('&');
  filterQuery = filterQuery ? `?${filterQuery}` : '';
  const param = {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  };
  const response: Response = await fetch(`${baseUrl}users/${userId}/aggregatedWords${filterQuery}`, param);
  switch (response.status) {
    case 200:
      const res = await response.json();
      return {wordsList: res[0].paginatedResults, totalWords: res[0].totalCount[0].count}
    case 401:
      const status = await updateTokens(userId);
      if (status) return await getUserAggregatedWords(userId, group, page, wordsPerPage, filter);
      else openAuthModal();
      break;
    default:
      throw new Error('Something went wrong');
  }
}

/* ------------- USERS/STATISTICS -------------- */
// in this block every request below
// if status===401 we need to update tokens
export const getUserStat = async (userId: string): Promise<Response> => {
  const param = {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  };
  return await fetch(`${baseUrl}users/${userId}/statistics`, param);
};

//TODO: define stat type!!!
export const putUserStat = async (userId: string, stat: any): Promise<Response> => {
  const param = {
    method: 'PUT',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stat),
  };
  return await fetch(`${baseUrl}users/${userId}/statistics`, param);
};
