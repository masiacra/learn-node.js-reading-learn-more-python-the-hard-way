'use strict';
const { getCLIVariables } = require('./helpers');
/*
  Small programm which should parse command line arguments.
*/

const main = () => {
  const args = process.argv.slice(2);

  const variables = getCLIVariables(args);

  console.log(variables);
};

main();
