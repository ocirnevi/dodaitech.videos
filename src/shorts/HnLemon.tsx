import scriptJson from '../../script/hn-lemon.json';
import narration from '../data/hn-lemon/narration.json';
import wordsJson from '../data/hn-lemon/words.json';
import beatsJson from '../data/hn-lemon/beats.json';
import {hellonutrition} from '../brands/hellonutrition';
import type {Word} from '../script';
import {makeLemon, type LemonCopy} from './Lemon';

/** Hello Nutrition AI · "Lemon unlocks plant iron" (inglés, voz Matilda). Puesta en escena en `Lemon.tsx`. */
export const hnLemonCopy: LemonCopy = {
  hook: {lines: ['Add citrus.', 'Get the most', 'from beans.'], lemon: 'lemon', iron: 'iron'},
  why: {label: 'iron'},
  foods: {label: 'where the iron is', title: 'Plant sources', words: ['beans', 'lentils', 'spinach']},
  but: {lines: ['Locked.'], lockWord: 'harder'},
  vitc: {lines: ['The key:', 'a lemon.'], word: 'vitamin'},
  absorb: {lines: ['Unlocked.'], word: 'absorb', iron: 'iron'},
  beans: {lines: ['Try it tonight:'], beans: 'beans', lemon: 'lemon'},
  pair: {lines: ['No lemon? Try:'], words: ['lentils', 'peppers', 'tomatoes']},
  follow: {nameLines: ['Hello', 'Nutrition.AI'], nameWord: 'more', sub: 'simple · science-backed', subWord: 'tips'},
};

const k = makeLemon({script: scriptJson, narration, words: wordsJson as Record<string, Word[]>, beats: beatsJson, brand: hellonutrition, copy: hnLemonCopy});
export const HnLemon = k.Comp;
export const hnLemonTimeline = k.timeline;
export const HN_LEMON = k.meta;
