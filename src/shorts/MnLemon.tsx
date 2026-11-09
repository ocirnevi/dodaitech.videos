import scriptJson from '../../script/mn-lemon.json';
import narration from '../data/mn-lemon/narration.json';
import wordsJson from '../data/mn-lemon/words.json';
import beatsJson from '../data/mn-lemon/beats.json';
import {minutriologo} from '../brands/minutriologo';
import type {Word} from '../script';
import {makeLemon, type LemonCopy} from './Lemon';

/** Mi Nutriólogo · "El limón libera el hierro vegetal" (español, voz Matilda). Puesta en escena en `Lemon.tsx`. */
export const mnLemonCopy: LemonCopy = {
  hook: {lines: ['Agrega cítrico.', 'Aprovecha mejor', 'tus frijoles.'], lemon: 'limón', iron: 'hierro'},
  why: {label: 'hierro'},
  foods: {label: 'dónde está el hierro', title: 'Fuentes vegetales', words: ['frijoles', 'lentejas', 'espinacas']},
  but: {lines: ['Bloqueado.'], lockWord: 'cuesta'},
  vitc: {lines: ['La llave:', 'un limón.'], word: 'vitamina'},
  absorb: {lines: ['Desbloqueado.'], word: 'absorber', iron: 'hierro'},
  beans: {lines: ['Pruébalo hoy:'], beans: 'frijoles', lemon: 'limón'},
  pair: {lines: ['¿Sin limón? Prueba:'], words: ['lentejas', 'pimientos', 'jitomate']},
  follow: {nameLines: ['Mi', 'Nutriólogo'], nameWord: 'más', sub: 'simple y con ciencia', subWord: 'consejos'},
};

const k = makeLemon({script: scriptJson, narration, words: wordsJson as Record<string, Word[]>, beats: beatsJson, brand: minutriologo, copy: mnLemonCopy});
export const MnLemon = k.Comp;
export const mnLemonTimeline = k.timeline;
export const MN_LEMON = k.meta;
