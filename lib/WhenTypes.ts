export type Expr =
  | {
      op: "and" | "or";
      exprs: Expr[];
    }
  | boolean;

export type CondProps = { [_: string]: any };
