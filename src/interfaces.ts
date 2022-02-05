export interface Word {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
}
export interface SignInParam {
  email: string;
  password: string;
}
export interface User {
  name: string;
  email: string;
}
export interface PostUser extends User {
  password: string;
}
export interface ResponseUser extends User {
  id: string;
}

export interface AuthParam {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}
export interface Tokens {
  token: string;
  refreshToken: string;
}
export interface FetchParam {
  method: string;
  withCredentials?: boolean;
  headers: {
    Authorization?: string;
    Accept?: string;
    'Content-Type'?: string;
  };
  body?: string;
}
