/*
  Copy of standard linux util cat
*/

import {
  getErrorMessage,
  writeFileToStdout,
  getOptions,
  printHelpMessage,
  printVersion,
} from './helpers';

const main = async (): Promise<number> => {
  if (process.argv.length < 3) {
    process.stderr.write('Error: Usage "node ./ex5 <filename>"');
    return 1;
  }

  const files = process.argv.slice(2);
  const optionsStrIndex = files.findIndex((arg) => arg.startsWith('-'));
  const optionsStr = optionsStrIndex !== -1 ? files[optionsStrIndex] : '';

  if (optionsStr !== '') {
    files.splice(optionsStrIndex, 1);
  }

  const options = getOptions(optionsStr.slice(1));

  if (options.displayHelp) {
    printHelpMessage();
  }

  if (options.displayVersion) {
    printVersion();
  }

  for await (const file of files) {
    try {
      await writeFileToStdout(file, options);
    } catch (error) {
      const errorMessage = getErrorMessage(error as NodeJS.ErrnoException, file);
      process.stderr.write(errorMessage);
    }
  }

  return 0;
};

main();
