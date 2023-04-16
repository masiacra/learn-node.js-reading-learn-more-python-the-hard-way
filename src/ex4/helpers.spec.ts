import { getCLIVariables, ADDITIONAL_CLI_ARGS } from './helpers';
import { ARGUMENT } from './constants';

const mockPositionalArguments = ['biba', 'bobe'];

describe(`${getCLIVariables.name}`, () => {
  describe('It should process situation of getting help when using --help or -h', () => {
    it(`should return object with field ${ARGUMENT.help} true if you pass --help`, () => {
      expect(getCLIVariables(ADDITIONAL_CLI_ARGS)(['some', 'any', '--help']).help).toEqual(true);
    });
    it(`should return object with field ${ARGUMENT.help} true if you pass -h`, () => {
      expect(getCLIVariables(ADDITIONAL_CLI_ARGS)(['-h']).help).toEqual(true);
    });
    it(`should return object with field ${ARGUMENT.help} false if you don't pass -h or --help`, () => {
      expect(getCLIVariables(ADDITIONAL_CLI_ARGS)([]).help).toEqual(false);
    });
  });
  describe(`It should set field ${ARGUMENT.watch}`, () => {
    it(`should set value of ${ARGUMENT.watch} if you pass --watch to true`, () => {
      expect(getCLIVariables(ADDITIONAL_CLI_ARGS)(['some', 'any', '--watch']).watch.value).toEqual(
        true
      );
    });
    it(`should set value of ${ARGUMENT.watch} if you pass -w to true`, () => {
      expect(getCLIVariables(ADDITIONAL_CLI_ARGS)(['some', 'any', '-w']).watch.value).toEqual(true);
    });
    it(`should set value of ${ARGUMENT.watch}  to false if you don't pass -w or --watch`, () => {
      expect(getCLIVariables(ADDITIONAL_CLI_ARGS)(['biba']).watch.value).toEqual(false);
    });
    it(`should set files field of ${ARGUMENT.watch} to non-empty array if you pas --watch and additional positional arguments`, () => {
      expect(
        getCLIVariables(ADDITIONAL_CLI_ARGS)(['--watch', ...mockPositionalArguments]).watch.files
      ).toStrictEqual(mockPositionalArguments);
    });
    it(`should set files field of ${ARGUMENT.watch} to non-empty array if you pas -w and additional positional arguments`, () => {
      expect(
        getCLIVariables(ADDITIONAL_CLI_ARGS)(['-w', ...mockPositionalArguments]).watch.files
      ).toStrictEqual(mockPositionalArguments);
    });
  });
  describe(`It should set field ${ARGUMENT.force}`, () => {
    it(`should set ${ARGUMENT.force} if you pass --force`, () => {
      expect(getCLIVariables(ADDITIONAL_CLI_ARGS)(['--force']).force.value).toEqual(true);
    });
    it(`should set ${ARGUMENT.force} if you pass -f`, () => {
      expect(getCLIVariables(ADDITIONAL_CLI_ARGS)(['some', 'any', '-f']).force.value).toEqual(true);
    });
    it(`should return object with field ${ARGUMENT.force} false if you don't pass -f or --force`, () => {
      expect(getCLIVariables(ADDITIONAL_CLI_ARGS)(['biba']).force.value).toEqual(false);
    });
    it(`should set files field of ${ARGUMENT.force} to non-empty array if you pass --force and additional positional arguments`, () => {
      expect(
        getCLIVariables(ADDITIONAL_CLI_ARGS)(['--force', ...mockPositionalArguments]).force.files
      ).toStrictEqual(mockPositionalArguments);
    });
    it(`should set files field of ${ARGUMENT.force} to non-empty array if you pass -f and additional positional arguments`, () => {
      expect(
        getCLIVariables(ADDITIONAL_CLI_ARGS)(['-f', ...mockPositionalArguments]).force.files
      ).toStrictEqual(mockPositionalArguments);
    });
  });
  describe(`It should set field ${ARGUMENT.template}`, () => {
    it("should set value to equal 'default' if you pass --template=default", () => {
      expect(
        getCLIVariables(ADDITIONAL_CLI_ARGS)(['--template=default']).template.value
      ).toStrictEqual('default');
    });
    it('should throw error if you incorrectly pass argument after --template', () => {
      expect(() => getCLIVariables(ADDITIONAL_CLI_ARGS)(['--template'])).toThrow();
    });
    it("should set value to equal 'default' if you pass -t=default", () => {
      expect(getCLIVariables(ADDITIONAL_CLI_ARGS)(['-t=default']).template.value).toStrictEqual(
        'default'
      );
    });
    it('should throw error if you incorrectly pass argument after -t', () => {
      expect(() => getCLIVariables(ADDITIONAL_CLI_ARGS)(['-t='])).toThrow();
    });
    it('should set files array if you pass any position arguments after --template', () => {
      expect(
        getCLIVariables(ADDITIONAL_CLI_ARGS)(['--template=default', ...mockPositionalArguments])
          .template.files
      ).toStrictEqual(mockPositionalArguments);
    });
    it('should set files array if you pass any position arguments after -t', () => {
      expect(
        getCLIVariables(ADDITIONAL_CLI_ARGS)(['-t=default', ...mockPositionalArguments]).template
          .files
      ).toStrictEqual(mockPositionalArguments);
    });
  });
});
