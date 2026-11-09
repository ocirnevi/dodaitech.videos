import scriptJson from '../../script/hn-kiwis.json';
import narration from '../data/hn-kiwis/narration.json';
import wordsJson from '../data/hn-kiwis/words.json';
import beatsJson from '../data/hn-kiwis/beats.json';
import {hellonutrition} from '../brands/hellonutrition';
import type {Word} from '../script';
import {makeKiwis, type KiwisCopy} from './Kiwis';

/** Hello Nutrition AI · "Two kiwis a day" (inglés, voz Matilda). Puesta en escena compartida en `Kiwis.tsx`. */
export const hnKiwisCopy: KiwisCopy = {
  hook: {lines: ['Two kiwis a day', 'to poop regularly?'], two: 'two', poop: 'poop'},
  yep: {two: 'Two'},
  research: {rows: [['less constipation', 'constipation'], ['less digestive discomfort', 'discomfort']], cite: 'Gearry et al., Am J Gastroenterol 2023 · randomized trial, 2 green kiwifruit/day · 4 weeks'},
  why: {lines: ["Here's why."]},
  contain: {items: [['fiber', 'fiber'], ['water', 'water'], ['actinidin', 'actinidin']], breakWord: 'break', note: 'an enzyme that breaks down proteins'},
  together: {lines: ['Together:', 'healthy digestion.'], together: 'Together', digestion: 'digestion'},
  best: {line: 'The best part?'},
  noneed: {lines: ['No supplements.', 'No routines.'], rows: [['expensive supplements', 'supplements'], ['complicated routines', 'routines']]},
  try: {lines: ['Two green kiwis.', 'Daily.'], two: 'two', daily: 'daily', pill: 'every day'},
  small: {first: 'Small changes.', big: 'Big difference.', bigWord: 'big'},
  follow: {nameLines: ['Hello', 'Nutrition.AI'], sub: 'science-backed nutrition tips', subWord: 'science', tipsWord: 'tips'},
};

const k = makeKiwis({script: scriptJson, narration, words: wordsJson as Record<string, Word[]>, beats: beatsJson, brand: hellonutrition, copy: hnKiwisCopy});
export const HnKiwis = k.Comp;
export const hnKiwisTimeline = k.timeline;
export const HN_KIWIS = k.meta;
