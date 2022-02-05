import { Tokens } from '../interfaces';

export const setTokens = (tokens: Tokens): void => {
  localStorage.setItem('tokens', JSON.stringify(tokens));
};
export const getToken = (type: string): string => {
  const tokens: Tokens = JSON.parse(<string>localStorage.getItem('tokens'));
  switch (type) {
    case 'main':
      return tokens.token;
    case 'refresh':
      return tokens.refreshToken;
    default:
      return '';
  }
};
