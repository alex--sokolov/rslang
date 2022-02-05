import { Tokens } from '../interfaces';

export const setTokens = (tokens: Tokens): void => {
  localStorage.setItem('tokens', JSON.stringify(tokens));
};
export const getToken = (type: string): string | null => {
  const tokens: Tokens = JSON.parse(<string>localStorage.getItem('tokens'));
  if (!tokens) return null;
  switch (type) {
    case 'main':
      return tokens.token;
    case 'refresh':
      return tokens.refreshToken;
    default:
      return null;
  }
};
export const setUserId = (id: string): void => {
  localStorage.setItem('id', id);
};
export const setUserName = (name: string): void => {
  localStorage.setItem('username', name);
};
export const getUserId = (): string => {
  return <string>localStorage.getItem('ig');
};
export const getUserName = (): string => {
  return <string>localStorage.getItem('username');
};
