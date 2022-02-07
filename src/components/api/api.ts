import { PostUser, ResponseUser, SignInParam, Tokens, Word } from '../../interfaces';
import { getToken, setTokens } from '../../utils/local-storage-helpers';

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
// in this block every request below
// if status===401 we need to update tokens
export const getUserWords = async (userId: string): Promise<Response> => {
  const param = {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  };
  return await fetch(`${baseUrl}users/${userId}/words`, param);
};

//TODO: define word type!!! The response type is based on word type.
export const addToUserWords = async (userId: string, wordId: string, word: any): Promise<Response> => {
  return await fetch(`${baseUrl}users/${userId}/words/${wordId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(word),
  });
};

export const getUserWordById = async (userId: string, wordId: string): Promise<Response> => {
  const param = {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  };
  return await fetch(`${baseUrl}users/${userId}/words/${wordId}`, param);
};

//TODO: define word type!!! The response type is based on word type.
export const putUserWordById = async (userId: string, wordId: string, word: any): Promise<Response> => {
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
  return await fetch(`${baseUrl}users/${userId}/words/${wordId}`, param);
};

export const deleteUserWordById = async (userId: string, wordId: string): Promise<boolean> => {
  const param = {
    method: 'DELETE',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken('main')}`,
      Accept: '*/*',
    },
  };
  const response = await fetch(`${baseUrl}users/${userId}/words/${wordId}`, param);
  return response.ok;
};

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
