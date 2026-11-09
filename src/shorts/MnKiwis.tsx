import scriptJson from '../../script/mn-kiwis.json';
import narration from '../data/mn-kiwis/narration.json';
import wordsJson from '../data/mn-kiwis/words.json';
import beatsJson from '../data/mn-kiwis/beats.json';
import {minutriologo} from '../brands/minutriologo';
import type {Word} from '../script';
import {makeKiwis, type KiwisCopy} from './Kiwis';

/** Mi Nutriólogo · "Dos kiwis al día" (español, voz Matilda). Mismo video que hn-kiwis con la marca hermana; puesta en escena en `Kiwis.tsx`. */
export const mnKiwisCopy: KiwisCopy = {
  hook: {lines: ['Dos kiwis al día', '¿para ir mejor', 'al baño?'], two: 'dos', poop: 'baño', accentLine: 2},
  yep: {two: 'Dos'},
  research: {rows: [['menos estreñimiento', 'estreñimiento'], ['menos molestias digestivas', 'molestias']], cite: 'Gearry et al., Am J Gastroenterol 2023 · ensayo aleatorizado, 2 kiwis verdes al día · 4 semanas'},
  why: {lines: ['Te explico', 'por qué.']},
  contain: {items: [['fibra', 'fibra'], ['agua', 'agua'], ['actinidina', 'actinidina']], breakWord: 'descomponer', note: 'una enzima que descompone proteínas'},
  together: {lines: ['Juntas:', 'digestión saludable.'], together: 'Juntas', digestion: 'digestión'},
  best: {line: '¿Y lo mejor?'},
  noneed: {lines: ['Sin suplementos.', 'Sin rutinas.'], rows: [['suplementos caros', 'suplementos'], ['rutinas complicadas', 'rutinas']]},
  try: {lines: ['Dos kiwis verdes.', 'Cada día.'], two: 'dos', daily: 'diaria', pill: 'cada día'},
  small: {first: 'Pequeños cambios.', big: 'Gran diferencia.', bigWord: 'gran'},
  follow: {nameLines: ['Mi', 'Nutriólogo'], sub: 'nutrición con respaldo científico', subWord: 'respaldo', tipsWord: 'científico'},
};

const k = makeKiwis({script: scriptJson, narration, words: wordsJson as Record<string, Word[]>, beats: beatsJson, brand: minutriologo, copy: mnKiwisCopy});
export const MnKiwis = k.Comp;
export const mnKiwisTimeline = k.timeline;
export const MN_KIWIS = k.meta;
