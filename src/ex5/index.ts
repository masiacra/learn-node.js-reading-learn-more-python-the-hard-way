/*
  Copy of standard linux util cat
*/

import { getErrorMessage, writeFileToStdout } from './helpers';

const main = async (): Promise<number> => {
  if (process.argv.length < 3) {
    process.stderr.write('Error: Usage "node ./ex5 <filename>"');
    return 1;
  }

  const files = process.argv.slice(2);

  for await (const file of files) {
    try {
      await writeFileToStdout(file);
    } catch (error) {
      const errorMessage = getErrorMessage(error as NodeJS.ErrnoException, file);
      process.stderr.write(errorMessage);
    }
  }

  return 0;
};

main();
