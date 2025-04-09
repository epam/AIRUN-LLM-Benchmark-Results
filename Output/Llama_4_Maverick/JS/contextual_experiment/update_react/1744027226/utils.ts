import { nanoid } from '@reduxjs/toolkit';

export function pluralize(count: number, word: string) {
  return count === 1 ? word : word + 's';
}

export function uuid() {
  return nanoid();
}