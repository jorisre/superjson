import { applyAnnotations, makeAnnotator } from './annotator';
import { isEmptyObject } from './is';
import { plainer } from './plainer';
import {
  SuperJSONResult,
  SuperJSONValue,
  isSuperJSONResult,
  Class,
} from './types';
import { ClassRegistry } from './class-registry';
import { SymbolRegistry } from './symbol-registry';

export const serialize = (object: SuperJSONValue): SuperJSONResult => {
  const { getAnnotations, annotator } = makeAnnotator();
  const output = plainer(object, annotator);

  const annotations = getAnnotations();

  return {
    json: output,
    meta: isEmptyObject(annotations) ? undefined : annotations,
  };
};

export const deserialize = <T = unknown>(payload: SuperJSONResult): T => {
  if (!isSuperJSONResult(payload)) {
    throw new Error('Not a valid SuperJSON payload.');
  }

  const { json, meta } = payload;

  const result: T = json as any;

  if (!!meta) {
    return applyAnnotations(result, meta);
  }

  return result;
};

const stringify = (object: SuperJSONValue): string =>
  JSON.stringify(serialize(object));

export const parse = <T = unknown>(string: string): T =>
  deserialize(JSON.parse(string));

const registerClass = (v: Class, identifier?: string) =>
  ClassRegistry.register(v, identifier);
const unregisterClass = (v: Class) => ClassRegistry.unregister(v);

const registerSymbol = (v: Symbol, identifier?: string) =>
  SymbolRegistry.register(v, identifier);
const unregisterSymbol = (v: Symbol) => SymbolRegistry.unregister(v);

export default {
  stringify,
  parse,
  serialize,
  deserialize,
  registerClass,
  unregisterClass,
  registerSymbol,
  unregisterSymbol,
};
