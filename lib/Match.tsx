import React from "react";
import {
  isFunctionPattern,
  MatchWithProps,
  Pattern,
  PatternMatchFn,
  Value,
} from "./MatchTypes";

const MatchWith = (_: MatchWithProps) => {
  throw new Error(
    "<Match.With /> is a stub and should never render. Seeing this is an error."
  );
};

const Wildcard = Symbol("Wildcard");
const Integer = Symbol("Integer");
const PostiveNumber = Symbol("PostiveNumber");
const NegativeNumber = Symbol("NegativeNumber");
const Finite = Symbol("Finite");

const patternMatch: PatternMatchFn = (value, pattern) => {
  switch (pattern) {
    case Wildcard: {
      return true;
    }
    case Integer: {
      return typeof value === "number" && Number.isInteger(value);
    }
    case PostiveNumber: {
      return typeof value === "number" && value > 0;
    }
    case NegativeNumber: {
      return typeof value === "number" && value < 0;
    }
    case Finite: {
      return typeof value === "number" && Number.isFinite(value);
    }
    case Array: {
      return Array.isArray(value);
    }
    case Object: {
      return typeof value === "object";
    }
    case Number: {
      return typeof value === "number";
    }
    case Boolean: {
      return typeof value === "boolean";
    }
    case Symbol: {
      return typeof value === "symbol";
    }
    case BigInt: {
      return typeof value === "bigint";
    }
    case String: {
      return typeof value === "string";
    }
    default: {
      if (isFunctionPattern(pattern)) {
        return pattern(value, { patternMatch, pattern });
      }

      if (typeof pattern === "number" && isNaN(pattern)) {
        return typeof value === "number" && isNaN(value);
      }

      if (typeof pattern !== typeof value) {
        return false;
      }

      switch (typeof value) {
        case "boolean":
        case "bigint":
        case "symbol":
        case "undefined":
        case "string": {
          return value === pattern;
        }
        case "number": {
          if (isNaN(value)) {
            return typeof pattern === "number" && isNaN(pattern);
          }

          return value === pattern;
        }
        case "object": {
          if (pattern === null || value === null) return value === pattern;

          return Object.entries(pattern).reduce<boolean>(
            (acc, [entryKey, entryValue]) => {
              return (
                acc &&
                entryKey in value &&
                patternMatch(value[entryKey], entryValue)
              );
            },
            true
          );
        }
      }
    }
  }
};

const Match = (props: {
  nonexhaustive?: boolean;
  value: Value;
  children: React.ReactNode;
}) => {
  if (!("value" in props)) {
    throw new Error(
      "[react-conditions] <Match /> requires a prop of value to match against."
    );
  }

  const children = React.Children.toArray(
    props.children
  ) as React.ReactElement<MatchWithProps>[];

  if (children.reduce((acc, child) => acc || child.type !== MatchWith, false)) {
    throw new Error(
      "[react-conditions] <Match /> may only have <Match.With />'s as children."
    );
  }

  const possibilities = children
    .map((c) => c.props)
    .reduceRight<{
      fallback: React.ReactNode;
      entries: {
        result: React.ReactNode;
        pattern: Pattern;
        when: boolean;
      }[];
    }>(
      (acc, childProps) => {
        const pattern = childProps.pattern;
        const when = "when" in childProps ? childProps.when : true;

        if (!("show" in childProps || "children" in childProps)) {
          return {
            fallback: acc.fallback,
            entries: [
              {
                pattern,
                when,
                result: acc.fallback,
              },
              ...acc.entries,
            ],
          };
        }

        let result: React.ReactNode = null;
        if ("children" in childProps) result = childProps.children;
        if ("show" in childProps) result = childProps.show;

        return {
          fallback: result,
          entries: [
            {
              result,
              pattern,
              when,
            },
            ...acc.entries,
          ],
        };
      },
      { fallback: null, entries: [] }
    ).entries;

  for (const { pattern, result, when } of possibilities) {
    if (patternMatch(props.value, pattern) && when) {
      return result;
    }
  }

  if (!props.nonexhaustive) {
    throw new Error(
      "[react-conditions] <Match /> did not match any of it's cases and did not indicate that it was nonexhaustive."
    );
  }

  return null;
};

Match.With = MatchWith;
Match.Wildcard = Wildcard;
Match._ = Match.Wildcard;
Match.Integer = Integer;
Match.PostiveNumber = PostiveNumber;
Match.NegativeNumber = NegativeNumber;
Match.Finite = Finite;

export default Match;

export type WildcardSymbolsU =
  | typeof Wildcard
  | typeof Integer
  | typeof PostiveNumber
  | typeof NegativeNumber
  | typeof Finite;
