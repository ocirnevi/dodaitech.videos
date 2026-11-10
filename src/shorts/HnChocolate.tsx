import scriptJson from '../../script/hn-chocolate.json';
import narration from '../data/hn-chocolate/narration.json';
import wordsJson from '../data/hn-chocolate/words.json';
import beatsJson from '../data/hn-chocolate/beats.json';
import {hellonutrition} from '../brands/hellonutrition';
import type {Word} from '../script';
import {makeChocolate} from './Chocolate';

/** Hello Nutrition AI · "Dark chocolate: the right kind matters" (inglés, voz Matilda). */
const k = makeChocolate({script: scriptJson, narration, words: wordsJson as Record<string, Word[]>, beats: beatsJson, brand: hellonutrition, copy: {
  hook: {lines: ['A sweet', 'surprise.'], health: 'health'},
  catch: {lines: ['Read the', 'fine print.'], equal: 'equal'},
  flavanols: {flavanols: 'flavanols', flow: 'flow'},
  sugar: {lines: ['Mostly', 'sweetener.'], sugar: 'sugar', cocoa: 'cocoa'},
  look: {lines: ['Label', 'check.']},
  checklist: {lines: ['Your', 'checklist:'], higher: 'higher', sugar: 'sugar', small: 'small'},
  remember: {lines: ['Not just', 'the number.'], word: 'always', tags: ['alkalized', 'natural']},
  enjoy: {lines: ['Guilt-free', '(ish).'], word: 'enjoy'},
  right: {lines: ['Pick', 'smart.'], word: 'right'},
  follow: {nameLines: ['Hello', 'Nutrition.AI'], nameWord: 'more', sub: 'simple · science-backed', subWord: 'tips'},
}});
export const HnChocolate = k.Comp;
export const hnChocolateTimeline = k.timeline;
export const HN_CHOCOLATE = k.meta;
