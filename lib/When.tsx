import React from "react";
import { CondProps, Expr } from "./WhenTypes";

const lex = (condProps: CondProps) => {
  let tokens = Object.entries(condProps).flatMap(([name, value]) => {
    const orWise =
      name.startsWith("or") &&
      (name[2] === undefined || name[2] === name[2].toUpperCase());
    const andWise =
      name.startsWith("and") &&
      (name[3] === undefined || name[3] === name[3].toUpperCase());

    if (!(orWise || andWise))
      return [
        {
          type: "CONSTANT",
          name,
          value: typeof value === "function" ? value() : value,
        },
      ];

    return [
      {
        type: orWise ? "OR" : "AND",
      },
      {
        type: "CONSTANT",
        name,
        value: typeof value === "function" ? value() : value,
      },
    ];
  });

  return tokens;
};

const parse = (tokens) => {
  const parseConst = (past, future) => {
    if (past?.length !== 0 || future?.length !== 1)
      throw new Error("Invalid When expression");

    const [value] = future;

    return value;
  };

  const parseOr = (past, future) => {
    const [value, ...newFuture] = future;

    if (value === undefined) {
      return parseConst([], past);
    } else if (value.type === "OR") {
      return {
        type: "OR_EXPR",
        lh: parseConst([], past),
        rh: parseOr([], newFuture),
      };
    } else {
      return parseOr([...past, value], newFuture);
    }
  };

  const parseAnd = (past, future) => {
    const [value, ...newFuture] = future;

    if (value === undefined) {
      return parseOr([], past);
    } else if (value.type === "AND") {
      return {
        type: "AND_EXPR",
        lh: parseOr([], past),
        rh: parseAnd([], newFuture),
      };
    } else {
      return parseAnd([...past, value], newFuture);
    }
  };

  return parseAnd([], tokens);
};

const evaluateAst = (node) => {
  switch (node.type) {
    case "AND_EXPR":
      return evaluateAst(node.lh) && evaluateAst(node.rh);
    case "OR_EXPR":
      return evaluateAst(node.lh) || evaluateAst(node.rh);
    case "CONSTANT": {
      return !!node.value;
    }
  }
};

const evaluateExpr = (expr: Expr) => {
  if (typeof expr === "object" && expr.op && expr.exprs) {
    switch (expr.op) {
      case "and":
        return expr.exprs.reduce(
          (acc, expr) => acc && evaluateExpr(expr),
          true
        );
      case "or":
        return expr.exprs.reduce(
          (acc, expr) => acc || evaluateExpr(expr),
          false
        );
      default:
        throw new Error(`invalid operation: ${expr.op}`);
    }
  }

  return !!expr;
};

const When = ({
  show,
  children,
  ...props
}: {
  show: React.ReactElement;
  children: React.ReactNode;
  expr?: Expr;
} & CondProps) => {
  const { expr, ...astProps } = props;

  if ("expr" in props && Object.keys(astProps).length !== 0) {
    throw new Error(
      "<When />'s expr API and english API cannot be used at the same time."
    );
  }

  if (!("expr" in props) && Object.keys(astProps).length === 0) {
    throw new Error(
      "A <When /> was rendered without any conditional props. This renders nothing. It is a no-op, and it is likely a bug."
    );
  }

  let cond = false;

  if ("expr" in props) cond = evaluateExpr(expr);
  if (Object.keys(astProps).length > 0)
    cond = evaluateAst(parse(lex(astProps)));

  return cond ? show ?? children : null;
};

export default When;
