import { createReadStream } from 'fs';

export const writeFileToStdout = (filename: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!filename) {
      reject('Error: use this function with correct filename');
    }
    const readStream = createReadStream(filename);

    readStream.pipe(process.stdout);

    readStream.on('end', () => {
      resolve();
    });

    readStream.on('error', (error) => {
      reject(error);
    });
  });
};

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

export const containsHelpParam = (args: string[]): boolean =>
  !!args.find((element) => element === '-h' || element === '--help');
