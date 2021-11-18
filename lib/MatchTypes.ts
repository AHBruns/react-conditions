import { WildcardSymbolsU } from "./Match";

export type Value = unknown;

export type PatternMatchFn = (value: Value, pattern: Pattern) => boolean;

type FunctionPattern = (
  value: Value,
  meta: { patternMatch: PatternMatchFn; pattern: FunctionPattern }
) => boolean;

export const isFunctionPattern = (v: unknown): v is FunctionPattern => {
  return typeof v === "function";
};

export type Pattern =
  | string
  | boolean
  | undefined
  | object
  | symbol
  | number
  | FunctionPattern
  | WildcardSymbolsU
  | ArrayConstructor
  | ObjectConstructor
  | NumberConstructor
  | BooleanConstructor
  | SymbolConstructor
  | BigIntConstructor
  | StringConstructor;

export type Predicate = boolean;

export type MatchWithProps = {
  pattern: Pattern;
  when?: Predicate;
  show?: React.ReactChild;
  children?: React.ReactNode;
};
