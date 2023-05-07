import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import type { Options } from './types';

export const getErrorMessage = (error: NodeJS.ErrnoException, file: string): string => {
  switch (error.code) {
    case 'ENOENT': {
      return `Error: No such file ${file}\n`;
    }
    case 'EACCES': {
      return `Error: Can't read file ${file}. Please, contact your administrator\n`;
    }
    default: {
      return `Error: Unknown problem with file ${file}\n`;
    }
  }
};

export const identity = (argument: string): string => argument;

export const dollarize = (str: string): string => (str.length > 0 ? `${str}$` : '');

export const createGetStringWithLineNumber = () => {
  let stringCount: number = 1;

  return (str: string): string => (str.length > 0 ? `${stringCount++}${str}` : str);
};

export const createGetStringWithLineIfNotEmpty = () => {
  const getStringWithLineNumber = createGetStringWithLineNumber();

  return (str: string): string => {
    if (str.length === 0) {
      return str;
    }

    if (str.trim().length !== 0) {
      return getStringWithLineNumber(str);
    }

    return str;
  };
};

export const createRemoveDuplicateEmptyString = () => {
  let prevIsEmpty: boolean = false;

  return (str: string): string => {
    if (str.trim() === '') {
      if (prevIsEmpty) {
        return '';
      }
      prevIsEmpty = true;
      return str;
    }

    prevIsEmpty = false;

    return str;
  };
};

export const getStringWithReplacedTabs = (str: string): string => str.replace(/\t/g, '^|');

export const printHelpMessage = (): void => {
  const message = `This is my version of util cat.
  Usage: node index.js [-belnstuvh] [file...]
  Options:
    -b - add line numbers to non-empty lines;
    -E - add symbol "$" to the end of the lines;
    -n - add line numbers to all lines;
    -s - delete empty duplicate lines;
    -T - replace tabulations by ^|;
    -h - display help;
    -v - current version of the programm;
  `;

  console.log(message);
  process.exit(0);
};

export const printVersion = (): void => {
  console.log('1.0.0');
  process.exit(0);
};

export const createProcessLineCallback = ({
  hasLines,
  hasNonEmptyLines,
  hasDollars,
  deleteEmptyDuplicates,
  replaceTabs,
}: Omit<Options, 'displayHelp' | 'displayVersion'>) => {
  const callbacks: ((str: string) => string)[] = [identity];

  if (deleteEmptyDuplicates) {
    callbacks.push(createRemoveDuplicateEmptyString());
  }
  if (hasNonEmptyLines) {
    callbacks.push(createGetStringWithLineIfNotEmpty());
  }
  if (hasLines && !hasNonEmptyLines) {
    callbacks.push(createGetStringWithLineNumber());
  }
  if (hasDollars) {
    callbacks.push(dollarize);
  }
  if (replaceTabs) {
    callbacks.push(getStringWithReplacedTabs);
  }

  return (str: string): string => callbacks.reduce<string>((acc, cur) => cur(acc), str);
};

export const getOptions = (optionsStr: string): Options => {
  const options = {
    displayHelp: false,
    displayVersion: false,
    hasNonEmptyLines: false,
    hasDollars: false,
    hasLines: false,
    deleteEmptyDuplicates: false,
    replaceTabs: false,
  };

  for (const symb of optionsStr) {
    switch (symb) {
      case 'h': {
        options.displayHelp = true;
        break;
      }
      case 'v': {
        options.displayVersion = true;
        break;
      }
      case 'E': {
        options.hasDollars = true;
        break;
      }
      case 'b': {
        options.hasNonEmptyLines = true;
        break;
      }
      case 'n': {
        options.hasLines = true;
        break;
      }
      case 'T': {
        options.replaceTabs = true;
        break;
      }
      case 'S': {
        options.deleteEmptyDuplicates = true;
        break;
      }
      default: {
        console.error(`Error: Unknow option ${symb}`);
      }
    }
  }

  return options;
};

export const writeFileToStdout = (
  filename: string,
  options: Omit<Options, 'displayHelp' | 'displayVersion'>
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!filename) {
      reject('Error: use this function with correct filename');
    }

    const readline = createInterface({
      input: createReadStream(filename),
    });

    const processLineCallback = createProcessLineCallback(options);

    readline.on('line', (line) => {
      process.stdout.write(`${processLineCallback(line)}\n`);
    });

    readline.on('end', () => {
      resolve();
      readline.close();
    });

    readline.on('error', (error) => {
      reject(error);
      readline.close();
    });
  });
};
