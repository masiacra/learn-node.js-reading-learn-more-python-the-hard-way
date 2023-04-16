'use strict';
import { getCLIVariables, ADDITIONAL_CLI_ARGS } from './helpers';
import { HELP_TEXT, ARGUMENT } from './constants';
/*
  Small programm which should parse command line arguments.
*/

const main = (): number => {
  const args = process.argv.slice(2);
  const variables = getCLIVariables(ADDITIONAL_CLI_ARGS)(args);

  if (variables.help) {
    console.log(HELP_TEXT);
    return 0;
  }

  Object.keys(ARGUMENT).forEach((key) => {
    const { files, value } = variables[key];
    let msg = '';

    if (value) {
      msg += `received ${key}${typeof value === 'string' ? ` with value ${value}` : ''}`;

      if (files) {
        msg += `with positional arguments ${files.join(', ')}`;
      }

      console.log(msg);
    }
  });

  return 0;
};

main();
