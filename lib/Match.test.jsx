import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Match from "./Match";

test("match number value works", async () => {
  const value = Math.random() * 999999;

  render(
    <Match value={value}>
      <Match.With pattern={value} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match string value works", async () => {
  const value = (Math.random() + 1).toString(36).substring(7);

  render(
    <Match value={value}>
      <Match.With pattern={value} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match undefined value works", async () => {
  const value = undefined;

  render(
    <Match value={value}>
      <Match.With pattern={value} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match null value works", async () => {
  const value = null;

  render(
    <Match value={value}>
      <Match.With pattern={value} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match symbol value works", async () => {
  const value = Symbol();

  render(
    <Match value={value}>
      <Match.With pattern={value} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match true value works", async () => {
  render(
    <Match value={true}>
      <Match.With pattern={true} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match false value works", async () => {
  render(
    <Match value={false}>
      <Match.With pattern={false} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match bigint value works", async () => {
  const value =
    BigInt(Math.round(Math.random() * 100)) * BigInt(9999999999999999999999999);

  render(
    <Match value={value}>
      <Match.With pattern={value} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("successful predicate function works", async () => {
  render(
    <Match value={1}>
      <Match.With pattern={() => true} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("failed predicate function causes no match and therefore and error", async () => {
  expect(() => {
    render(
      <Match value={1}>
        <Match.With pattern={() => false} show={<p>MATCHED</p>} />
      </Match>
    );
  }).toThrowError();
});

test("match explicit wildcard works", async () => {
  render(
    <Match value={1}>
      <Match.With pattern={Match.Wildcard} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match _ wildcard works", async () => {
  render(
    <Match value={1}>
      <Match.With pattern={Match._} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match Number constructor works", async () => {
  render(
    <Match value={1}>
      <Match.With pattern={Number} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match Integer works", async () => {
  render(
    <Match value={1}>
      <Match.With pattern={Match.Integer} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match NaN failure case", async () => {
  render(
    <Match value={NaN}>
      <Match.With pattern={1} show={<p>MATCHED</p>} />
      <Match.With pattern={NaN} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match String constructor works", async () => {
  render(
    <Match value={"xyz"}>
      <Match.With pattern={String} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match Object constructor works", async () => {
  render(
    <Match value={{ a: 1 }}>
      <Match.With pattern={Object} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match Array constructor works", async () => {
  render(
    <Match value={[1, 2, 3]}>
      <Match.With pattern={Array} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match Boolean constructor works", async () => {
  render(
    <Match value={false}>
      <Match.With pattern={Boolean} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match Symbol constructor works", async () => {
  render(
    <Match value={Symbol("xyz")}>
      <Match.With pattern={Symbol} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match BigInt constructor works", async () => {
  render(
    <Match value={BigInt(1)}>
      <Match.With pattern={BigInt} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("no matches throws an error", async () => {
  expect(() => {
    render(
      <Match value={1}>
        <Match.With pattern={"not the value"} show={<p>MATCHED</p>} />
      </Match>
    );
  }).toThrowError();
});

test("no matches with nonexhaustive to fail silently", async () => {
  expect(() => {
    render(
      <Match value={1} nonexhaustive>
        <Match.With pattern={"not the value"} show={<p>MATCHED</p>} />
      </Match>
    );
  }).not.toThrowError();
});

test("deep object matching works", async () => {
  render(
    <Match value={{ a: { b: { c: 1 } } }}>
      <Match.With pattern={{ a: { b: { c: 1 } } }} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("partial object matching works", async () => {
  render(
    <Match value={{ a: { b: { c: 1, y: 2 } }, x: 2 }}>
      <Match.With pattern={{ a: { b: { c: 1 } } }} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("complex compound usage", async () => {
  render(
    <Match
      value={{
        a: {
          a: {
            a: 2,
            b: BigInt(1),
            c: "abc",
            d: [1, "a", 2],
          },
          b: -1,
          c: Infinity,
          d: 100,
        },
        b: 2,
        c: Symbol("xyz"),
      }}
    >
      <Match.With
        pattern={{
          a: {
            a: {
              a: 2,
              b: BigInt,
              c: String,
              d: Array,
            },
            b: Match.NegativeNumber,
            c: Number,
            d: Match.Finite,
          },
          b: Match.PostiveNumber,
          c: Symbol,
        }}
        show={<p>MATCHED</p>}
      />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match one of multiple cases", async () => {
  render(
    <Match
      value={{
        a: {
          a: {
            a: 2,
          },
        },
      }}
    >
      <Match.With pattern={{ a: { a: { a: "abc" } } }} show={<p>NOPE 1</p>} />
      <Match.With
        pattern={{
          a: {
            a: {
              a: 2,
            },
          },
        }}
        show={<p>MATCHED</p>}
      />
      <Match.With pattern={{ a: { a: { a: 2 } } }} show={<p>NOPE 2</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("fallthrough works", async () => {
  render(
    <Match
      value={{
        a: {
          a: {
            a: 2,
          },
        },
      }}
    >
      <Match.With pattern={{ a: "no match" }} show={<p>NOPE 1</p>} />
      <Match.With
        pattern={{
          a: {
            a: {
              a: 2,
            },
          },
        }}
      />
      <Match.With pattern={{ a: "no match" }} show={<p>MATCHED</p>} />
      <Match.With pattern={{ a: "no match" }} show={<p>NOPE 2</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("missing value prop throws an error", async () => {
  expect(() => {
    render(
      <Match>
        <Match.With
          pattern={"shouldn't matter because the error is in Match"}
          show={<p>MATCHED</p>}
        />
      </Match>
    );
  }).toThrowError();
});

test("missing pattern matches undefined", async () => {
  render(
    <Match value={undefined}>
      <Match.With show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("match but no show renders null silenty", async () => {
  render(
    <Match value={1}>
      <Match.With pattern={1} />
    </Match>
  );
});

test("predicate function which delegates", async () => {
  render(
    <Match value={{ a: { b: { c: 1 } } }}>
      <Match.With
        pattern={{
          a: (value, meta) => {
            return (
              JSON.stringify(value) === `{\"b\":{\"c\":1}}` &&
              meta.patternMatch(value.b, { c: 1 })
            );
          },
        }}
        show={<p>MATCHED</p>}
      />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("first match wins", async () => {
  render(
    <Match value={{ a: 1 }}>
      <Match.With pattern={{ a: Number }} show={<p>MATCHED 1</p>} />
      <Match.With pattern={{ a: 1 }} show={<p>MATCHED 2</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED 1")).toBeInTheDocument();
});

test("when works", async () => {
  render(
    <Match value={1}>
      <Match.With pattern={1} when={true} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("when failure causes matching to continue to next case", async () => {
  render(
    <Match value={1}>
      <Match.With pattern={1} when={false} show={<p>NOPE</p>} />
      <Match.With pattern={1} show={<p>MATCHED</p>} />
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("throw errors when unknown child is given", async () => {
  expect(() => {
    render(
      <Match value={1}>
        <Match.With pattern={1} show={<p>MATCHED</p>} />
        <p>wtf is this</p>
      </Match>
    );
  }).toThrowError();
});

test("using children instead of show works", async () => {
  render(
    <Match value={1}>
      <Match.With pattern={1}>
        <p>MATCHED</p>
      </Match.With>
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("children works with fallback", async () => {
  render(
    <Match value={1}>
      <Match.With pattern={1} />
      <Match.With pattern={2}>
        <p>MATCHED</p>
      </Match.With>
    </Match>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("Match.With alone throws an error", async () => {
  expect(() => {
    render(<Match.With pattern={1} show={<p>MATCHED</p>} />);
  }).toThrowError();
});
