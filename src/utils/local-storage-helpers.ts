import { Tokens } from '../interfaces';

export const setTokens = (tokens: Tokens): void => {
  localStorage.setItem('tokens', JSON.stringify(tokens));
};
export const getToken = (type?: string): string | null => {
  const tokens: Tokens = JSON.parse(<string>localStorage.getItem('tokens'));
  if (!tokens) return null;
  return type === 'refresh' ? tokens.refreshToken : tokens.token;
};
export const setUserId = (id: string): void => {
  localStorage.setItem('id', id);
};
export const setGameLevel = (level: string): void => {
  localStorage.setItem('gameLevel', level);
};
export const setUserName = (name: string): void => {
  localStorage.setItem('username', name);
};
export const setPage = (page: string): void => {
  localStorage.setItem('page', page);
};
export const setGroup = (group: string): void => {
  localStorage.setItem('group', group);
};
export const getUserId = (): string => {
  return <string>localStorage.getItem('id');
};
export const getGameLevel = (): string => {
  return <string>localStorage.getItem('gameLevel');
};
export const getGameLevel = (): string => {
  return <string>localStorage.getItem('gameLevel');
};
export const getUserName = (): string => {
  return <string>localStorage.getItem('username');
};
export const getPage = (): string => {
  return <string>localStorage.getItem('page');
};
export const getGroup = (): string => {
  return <string>localStorage.getItem('group');
};
