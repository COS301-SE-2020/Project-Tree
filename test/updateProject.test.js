const updateProject = require("../api/projectApi/updateProject");

test("Coverts date obejct to date string", () => {
  let datetime = {
    year: { low: 1970, high: 0 },
    month: { low: 1, high: 0 },
    day: { low: 2, high: 0 },
    hour: { low: 2, high: 0 },
    minute: { low: 26, high: 0 },
    second: { low: 0, high: 0 },
    nanosecond: { low: 0, high: 0 },
  };
  expect(updateProject.datetimeToString(datetime)).toBe("1970-01-02T02:26");
});

test("Finds all dependencies before of the task sent in(should return 2)", () => {
  let task = { id: 1, };
  let rels = [
    { target: 1, },
    { target: 1, },
    { target: 3, },
  ];
  expect(updateProject.getPredDependencies(task, rels)).toStrictEqual([ { target: 1, }, { target: 1, }, ]);
});

test("Finds all dependencies before of the task sent in(should return 0)", () => {
  let task = { id: 5, };
  let rels = [
    { target: 1, },
    { target: 2, },
    { target: 3, },
    { target: 4, },
  ];
  expect(updateProject.getPredDependencies(task, rels)).toStrictEqual([ ]);
});

test("Finds all dependencies after of the task sent in(should return 2)", () => {
  let task = { id: 1, };
  let rels = [
    { source: 1, },
    { source: 1, },
    { source: 3, },
  ];
  expect(updateProject.getSuccDependencies(task, rels)).toStrictEqual([ { source: 1, }, { source: 1, }, ]);
});

test("Finds all dependencies after of the task sent in(should return 0)", () => {
  let task = { id: 5, };
  let rels = [
    { source: 1, },
    { source: 2, },
    { source: 3, },
    { source: 4, },
  ];
  expect(updateProject.getSuccDependencies(task, rels)).toStrictEqual([ ]);
});

test("Finds all successors the task sent in(should return 2)", () => {
  let nodes = [
    { id: 1, },
    { id: 2, },
    { id: 3, },
  ];
  let rels = [
    { source: 1,  target: 2, },
    { source: 1, target: 3, },
    { source: 3, target: 2, },
  ];
  expect(updateProject.getSuccessors(1, nodes, rels)).toStrictEqual([ { id: 2 }, { id: 3 } ]);
});

test("Finds all successors the task sent in(should return 0)", () => {
  let nodes = [
    { id: 1, },
    { id: 2, },
    { id: 3, },
    { id: 4, },
    { id: 5, },
  ];
  let rels = [
    { source: 3, target: 2, },
  ];
  expect(updateProject.getSuccessors(1, nodes, rels)).toStrictEqual([ ]);
});
