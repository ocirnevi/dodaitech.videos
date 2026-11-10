import scriptJson from '../../script/hn-strawberry.json';
import narration from '../data/hn-strawberry/narration.json';
import wordsJson from '../data/hn-strawberry/words.json';
import beatsJson from '../data/hn-strawberry/beats.json';
import {hellonutrition} from '../brands/hellonutrition';
import type {Word} from '../script';
import {makeStrawberry} from './Strawberry';

/** Hello Nutrition AI · "Strawberries beat oranges on vitamin C" (inglés, voz Matilda). */
const k = makeStrawberry({script: scriptJson, narration, words: wordsJson as Record<string, Word[]>, beats: beatsJson, brand: hellonutrition, copy: {
  hook: {lines: ['The unexpected', 'champion.'], oranges: 'oranges'},
  yep: {lines: ['Gold', 'medal.'], win: 'win'},
  numbers: {n1: '59', n2: '53', oranges: 'oranges'},
  more: {lines: ['Beyond', 'defense.'], immune: 'immune'},
  collagen: {collagen: 'collagen', words: ['skin', 'bones', 'vessels']},
  iron: {lines: ['Fe:', 'unlocked.'], absorb: 'absorb'},
  boost: {lines: ['Snack', 'upgrade.'], word: 'forget'},
  follow: {nameLines: ['Hello', 'Nutrition.AI'], nameWord: 'more', sub: 'simple · science-backed', subWord: 'tips'},
}});
export const HnStrawberry = k.Comp;
export const hnStrawberryTimeline = k.timeline;
export const HN_STRAWBERRY = k.meta;
