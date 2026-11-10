import scriptJson from '../../script/mn-chocolate.json';
import narration from '../data/mn-chocolate/narration.json';
import wordsJson from '../data/mn-chocolate/words.json';
import beatsJson from '../data/mn-chocolate/beats.json';
import {minutriologo} from '../brands/minutriologo';
import type {Word} from '../script';
import {makeChocolate} from './Chocolate';

/** Mi Nutriólogo · "Chocolate oscuro: el tipo correcto importa" (español, voz Matilda). */
const k = makeChocolate({script: scriptJson, narration, words: wordsJson as Record<string, Word[]>, beats: beatsJson, brand: minutriologo, copy: {
  hook: {lines: ['Una dulce', 'sorpresa.'], health: 'salud'},
  catch: {lines: ['Lee la', 'letra chica.'], equal: 'iguales'},
  flavanols: {flavanols: 'flavanoles', flow: 'flujo'},
  sugar: {lines: ['Casi puro', 'dulce.'], sugar: 'azúcar', cocoa: 'cacao'},
  look: {lines: ['Revisa la', 'etiqueta.']},
  checklist: {lines: ['Tu lista', 'rápida:'], higher: 'más', sugar: 'azúcar', small: 'pequeñas'},
  remember: {lines: ['No solo', 'el número.'], word: 'siempre', tags: ['alcalinizado', 'natural']},
  enjoy: {lines: ['Sin culpa', '(con medida).'], word: 'disfrutar'},
  right: {lines: ['Elige', 'bien.'], word: 'correcto'},
  follow: {nameLines: ['Mi', 'Nutriólogo'], nameWord: 'más', sub: 'simple y con ciencia', subWord: 'consejos'},
}});
export const MnChocolate = k.Comp;
export const mnChocolateTimeline = k.timeline;
export const MN_CHOCOLATE = k.meta;
