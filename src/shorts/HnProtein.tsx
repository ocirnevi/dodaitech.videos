import scriptJson from '../../script/hn-protein.json';
import narration from '../data/hn-protein/narration.json';
import wordsJson from '../data/hn-protein/words.json';
import beatsJson from '../data/hn-protein/beats.json';
import {hellonutrition} from '../brands/hellonutrition';
import type {Word} from '../script';
import {makeProtein, type ProteinCopy} from './Protein';

/** Hello Nutrition AI · "Protein breakfast keeps you full" (inglés, voz Matilda). Puesta en escena en `Protein.tsx`. */
export const hnProteinCopy: ProteinCopy = {
  hook: {lines: ['A breakfast', 'that lasts.'], protein: 'protein', full: 'full'},
  hormones: {label: 'the signal', lines: ['Message:', '“I’m good.”'], hormones: 'hormones', brain: 'brain'},
  digest: {lines: ['Slow burn.'], digest: 'digest'},
  swap: {lines: ['Upgrade', 'the plate:'], toast: 'toast', words: ['eggs', 'yogurt', 'cottage']},
  satisfied: {lines: ['Good until', 'noon.'], times: ['8 AM', '12 PM'], word: 'lunch'},
  follow: {nameLines: ['Hello', 'Nutrition.AI'], nameWord: 'more', sub: 'simple · science-backed', subWord: 'tips'},
};

const k = makeProtein({script: scriptJson, narration, words: wordsJson as Record<string, Word[]>, beats: beatsJson, brand: hellonutrition, copy: hnProteinCopy});
export const HnProtein = k.Comp;
export const hnProteinTimeline = k.timeline;
export const HN_PROTEIN = k.meta;
