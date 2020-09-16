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