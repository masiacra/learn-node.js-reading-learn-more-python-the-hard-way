const { getCLIVariables } = require('./helpers');
const { ARGUMENT } = require('./constants');

describe(`${getCLIVariables.name}`, () => {
  describe('It should process situation of getting help when using --help or -h', () => {
    it(`should return object with field ${ARGUMENT.help} true if you pass --help`, () => {
      expect(getCLIVariables(['some', 'any', '--help']).help).toEqual(true);
    });
  });
});
