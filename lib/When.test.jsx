import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import When from "./When";

test("simple condition", async () => {
  render(<When x={true} show={<p>MATCHED</p>} />);

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("simple failure", async () => {
  render(<When x={false} show={<p>MATCHED</p>} />);

  expect(screen.queryByText("MATCHED")).toBeNull();
});

test("multi-and condition", async () => {
  render(<When x={true} andY={true} andZ={true} show={<p>MATCHED</p>} />);

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("multi-and failure", async () => {
  render(<When x={true} andY={true} andZ={false} show={<p>MATCHED</p>} />);

  expect(screen.queryByText("MATCHED")).toBeNull();
});

test("multi-or condition", async () => {
  render(<When x={false} orY={false} orZ={true} show={<p>MATCHED</p>} />);

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("multi-or failure", async () => {
  render(<When x={false} orY={false} orZ={false} show={<p>MATCHED</p>} />);

  expect(screen.queryByText("MATCHED")).toBeNull();
});

test("invalid boolean expressions throw", async () => {
  expect(() => {
    render(<When x={true} y={true} show={<p>MATCHED</p>} />);
  }).toThrowError();
});

test("no condition defaults to true", async () => {
  expect(() => {
    render(<When show={<p>MATCHED</p>} />);
  }).toThrowError();
});

test("can't use the english API with the expr API", async () => {
  expect(() => {
    render(
      <When
        x={true}
        andY={true}
        expr={{ op: "and", exprs: [true, true] }}
        show={<p>MATCHED</p>}
      />
    );
  }).toThrowError();
});

test("expr API works", async () => {
  render(
    <When
      expr={{
        op: "and",
        exprs: [
          {
            op: "or",
            exprs: [false, false, { op: "and", exprs: [true, true] }],
          },
          true,
        ],
      }}
      show={<p>MATCHED</p>}
    />
  );

  expect(screen.queryByText("MATCHED")).toBeInTheDocument();
});

test("invalid op throws an error", async () => {
  expect(() => {
    render(
      <When
        expr={{
          op: "wtf",
          exprs: [true, true],
        }}
        show={<p>MATCHED</p>}
      />
    );
  }).toThrowError();
});

test("function conds", async () => {
  render(
    <When x={() => true} andY={true} andZ={() => true} show={<p>MATCHED</p>} />
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});

test("invalid english expression with at least 1 op", async () => {
  expect(() => {
    render(<When x={true} andY={true} z={true} show={<p>MATCHED</p>} />);
  }).toThrowError();
});

test("with children instead of show", async () => {
  render(
    <When x={true}>
      <p>MATCHED</p>
    </When>
  );

  expect(screen.getByText("MATCHED")).toBeInTheDocument();
});
