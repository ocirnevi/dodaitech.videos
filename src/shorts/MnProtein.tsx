import scriptJson from '../../script/mn-protein.json';
import narration from '../data/mn-protein/narration.json';
import wordsJson from '../data/mn-protein/words.json';
import beatsJson from '../data/mn-protein/beats.json';
import {minutriologo} from '../brands/minutriologo';
import type {Word} from '../script';
import {makeProtein, type ProteinCopy} from './Protein';

/** Mi Nutriólogo · "Desayuno con proteína" (español, voz Matilda). Puesta en escena en `Protein.tsx`. */
export const mnProteinCopy: ProteinCopy = {
  hook: {lines: ['Un desayuno', 'que rinde.'], protein: 'proteína', full: 'lleno'},
  hormones: {label: 'la señal', lines: ['Mensaje:', '“suficiente.”'], hormones: 'hormonas', brain: 'cerebro'},
  digest: {lines: ['A fuego', 'lento.'], digest: 'digerirse'},
  swap: {lines: ['Mejora', 'tu plato:'], toast: 'tostado', words: ['huevos', 'yogur', 'cottage']},
  satisfied: {lines: ['Hasta el', 'mediodía.'], times: ['8 AM', '12 PM'], word: 'comida'},
  follow: {nameLines: ['Mi', 'Nutriólogo'], nameWord: 'más', sub: 'simple y con ciencia', subWord: 'consejos'},
};

const k = makeProtein({script: scriptJson, narration, words: wordsJson as Record<string, Word[]>, beats: beatsJson, brand: minutriologo, copy: mnProteinCopy});
export const MnProtein = k.Comp;
export const mnProteinTimeline = k.timeline;
export const MN_PROTEIN = k.meta;
