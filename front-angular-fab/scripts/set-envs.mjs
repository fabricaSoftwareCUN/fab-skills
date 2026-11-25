#!/usr/bin/env node
// Genera src/environments/environment.ts y environment.prod.ts desde variables NG_APP_*.
// Uso: node scripts/set-envs.mjs [--root <dir>] [--check] [--allow-sensitive-names]
// Precedencia: process.env > .env > .env.example. Sin dependencias.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const CHECK = flag('--check');
const ALLOW = flag('--allow-sensitive-names');
const ROOT = opt('--root') ?? process.cwd();

const PREFIX = 'NG_APP_';
const HEADER = '// Generado por scripts/set-envs.mjs. No editar a mano.';
const SENSITIVE_TOKENS = new Set(['SECRET', 'PASSWORD', 'PRIVATE', 'TOKEN', 'KEY']);
const VALID_TYPES = new Set(['string', 'number', 'boolean']);
const MODEL = join(ROOT, 'src/environments/environment.model.ts');

function parseEnv(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    const k = line.slice(0, eq).trim();
    let v = line.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (v !== '') out[k] = v;
  }
  return out;
}

function loadFile(p) {
  return existsSync(p) ? parseEnv(readFileSync(p, 'utf8')) : {};
}

function camel(k) {
  return k.replace(PREFIX, '').toLowerCase().replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function snake(k) {
  return k.replace(/([A-Z])/g, '_$1').toUpperCase();
}

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

function isSensitive(name) {
  const tokens = name.replace(PREFIX, '').split('_');
  if (tokens[tokens.length - 1] === 'PUBLIC') return false;
  return tokens.some((t) => SENSITIVE_TOKENS.has(t));
}

function convert(val, type, key) {
  if (type === 'boolean') {
    if (val === 'true' || val === 'false') return val;
    fail(`${key}: se esperaba boolean (true/false)`);
  }
  if (type === 'number') {
    if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(val)) return val;
    fail(`${key}: se esperaba number`);
  }
  return JSON.stringify(val);
}

if (!existsSync(MODEL)) fail(`No existe ${MODEL}`);
let src = readFileSync(MODEL, 'utf8');
src = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
const entries = [...src.matchAll(/^\s*(?:readonly\s+)?(\w+)\??\s*:\s*([^\s;]+)/gm)]
  .map((m) => ({ key: m[1], type: m[2] }));
if (!entries.length) fail('No se encontraron propiedades en environment.model.ts');
for (const e of entries) {
  if (!VALID_TYPES.has(e.type)) {
    fail(`${e.key}: tipo no soportado en environment.model.ts (solo string, number, boolean)`);
  }
}
if (!entries.some((e) => e.key === 'production')) {
  entries.unshift({ key: 'production', type: 'boolean' });
}

const example = loadFile(join(ROOT, '.env.example'));
const local = loadFile(join(ROOT, '.env'));
const env = {};
for (const k of Object.keys(example)) if (k.startsWith(PREFIX)) env[k] = example[k];
for (const k of Object.keys(local)) if (k.startsWith(PREFIX)) env[k] = local[k];
for (const k of Object.keys(process.env)) {
  if (k.startsWith(PREFIX) && process.env[k] !== '') env[k] = process.env[k];
}

for (const k of Object.keys(env)) {
  if (isSensitive(k) && !ALLOW) {
    fail(`${k} viola R28 (token sensible sin sufijo _PUBLIC). Usa --allow-sensitive-names solo si es publica y documentalo en el README.`);
  }
}

const envMap = {};
for (const k of Object.keys(env)) envMap[camel(k)] = k;

const modelKeys = new Set(entries.map((e) => e.key));
for (const k of Object.keys(env)) {
  const prop = camel(k);
  if (!modelKeys.has(prop)) {
    console.warn(`ADVERTENCIA: ${k} no esta en el modelo, se ignora.`);
  }
}

const absent = entries.filter((e) => e.key !== 'production' && !(e.key in envMap));
if (absent.length) {
  fail(`Faltan claves en .env / .env.example / process.env: ${absent.map((e) => PREFIX + snake(e.key)).join(', ')}`);
}

const converted = {};
for (const e of entries) {
  if (e.key !== 'production') {
    converted[e.key] = convert(env[envMap[e.key]], e.type, envMap[e.key]);
  }
}

const body = (prod) =>
  [HEADER, `import type { AppEnvironment } from './environment.model';`, '', 'export const environment: AppEnvironment = {', `  production: ${prod},`]
    .concat(entries.filter((e) => e.key !== 'production').map((e) => `  ${e.key}: ${converted[e.key]},`))
    .concat(['};', ''])
    .join('\n');

if (CHECK) {
  console.log(`OK: ${entries.length} claves validadas (sin escritura).`);
  process.exit(0);
}

const dir = dirname(MODEL);
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'environment.ts'), body(false));
writeFileSync(join(dir, 'environment.prod.ts'), body(true));
console.log('Claves inyectadas:');
for (const e of entries) console.log(`  ${e.key}`);
