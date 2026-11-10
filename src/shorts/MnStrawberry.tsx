import scriptJson from '../../script/mn-strawberry.json';
import narration from '../data/mn-strawberry/narration.json';
import wordsJson from '../data/mn-strawberry/words.json';
import beatsJson from '../data/mn-strawberry/beats.json';
import {minutriologo} from '../brands/minutriologo';
import type {Word} from '../script';
import {makeStrawberry} from './Strawberry';

/** Mi Nutriólogo · "Las fresas le ganan a la naranja en vitamina C" (español, voz Matilda). */
const k = makeStrawberry({script: scriptJson, narration, words: wordsJson as Record<string, Word[]>, beats: beatsJson, brand: minutriologo, copy: {
  hook: {lines: ['La campeona', 'inesperada.'], oranges: 'naranjas'},
  yep: {lines: ['Medalla', 'de oro.'], win: 'ganan'},
  numbers: {n1: '59', n2: '53', oranges: 'naranjas'},
  more: {lines: ['No solo', 'defensas.'], immune: 'inmune'},
  collagen: {collagen: 'colágeno', words: ['piel', 'huesos', 'vasos']},
  iron: {lines: ['Fe:', 'desbloqueado.'], absorb: 'absorber'},
  boost: {lines: ['Antojo con', 'beneficio.'], word: 'olvides'},
  follow: {nameLines: ['Mi', 'Nutriólogo'], nameWord: 'más', sub: 'simple y con ciencia', subWord: 'consejos'},
}});
export const MnStrawberry = k.Comp;
export const mnStrawberryTimeline = k.timeline;
export const MN_STRAWBERRY = k.meta;
