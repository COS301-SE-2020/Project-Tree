const updateProject = require('../api/projectApi/updateProject');

test('Compares 2020-12-4 with 2020-11-10', () => {
  expect(updateProject.compareDates(2020, 12, 4, 2020, 11, 10)).toBe(0);
});

test('Compares 2020-11-10 with 2020-12-4', () => {
    expect(updateProject.compareDates(2020, 11, 10, 2020, 12, 4)).toBe(1);
});

test('Adds 5 days to 2020-06-04', () => {
    expect(updateProject.addDays(2020, 6, 4, 5)).toStrictEqual([2020, 6, 9]);
});

test('Adds 10 days to 2020-07-23 (Month Wrapping)', () => {
    expect(updateProject.addDays(2020, 7, 23, 10)).toStrictEqual([2020, 8, 2]);
});

test('Subtract 5 days to 2020-06-06', () => {
    expect(updateProject.addDays(2020, 6, 6, -5)).toStrictEqual([2020, 6, 1]);
});

test('Subtract 10 days to 2020-06-06 (Month Wrapping)', () => {
    expect(updateProject.addDays(2020, 6, 6, -10)).toStrictEqual([2020, 5, 27]);
});
