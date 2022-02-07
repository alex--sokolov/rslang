import { Word } from '../interfaces';

export function levelToGroup(level: string): string {
  switch (level) {
    case 'a1':
      return '0';
    case 'a2':
      return '1';
    case 'b1':
      return '2';
    case 'b2':
      return '3';
    case 'c1':
      return '4';
    case 'c2':
      return '5';
    default:
      return '0';
  }
}

export function shuffle(array: Array<Word>) {
  array.sort(() => Math.random() - 0.5);
}
