import {
  dollarize,
  createGetStringWithLineNumber,
  createGetStringWithLineIfNotEmpty,
  createRemoveDuplicateEmptyString,
  getStringWithReplacedTabs,
  createProcessLineCallback,
} from './helpers';

describe(`${dollarize.name}`, () => {
  it("should return non-empty string with symbol '$'", () => {
    expect(dollarize('$')).toEqual('$$');
  });
  it('should return empty string if you pass empty string', () => {
    expect(dollarize('')).toEqual('');
  });
});

describe(`${createGetStringWithLineNumber.name}`, () => {
  it('should return 2 strings with number 1 and 2 at the beggining if you pass non-empty strings', () => {
    const getStringWithLineNumber = createGetStringWithLineNumber();
    const str1 = getStringWithLineNumber('$');
    const str2 = getStringWithLineNumber('$');
    expect(str1).toEqual('1$');
    expect(str2).toEqual('2$');
  });
  it('should return empty string if you pass empty string', () => {
    const getStringWithLineNumber = createGetStringWithLineNumber();
    const str1 = getStringWithLineNumber('');
    const str2 = getStringWithLineNumber('');
    expect(str1).toEqual('');
    expect(str2).toEqual('');
  });
});

describe(`${createGetStringWithLineIfNotEmpty.name}`, () => {
  it('should return 2 strings with number 1 and 2 at the beggining if you pass non-empty strings', () => {
    const getStringWithLineNumber = createGetStringWithLineIfNotEmpty();
    const str1 = getStringWithLineNumber('$');
    const str2 = getStringWithLineNumber('$');
    expect(str1).toEqual('1$');
    expect(str2).toEqual('2$');
  });
  it('should return empty string if you pass empty string', () => {
    const getStringWithLineNumber = createGetStringWithLineIfNotEmpty();
    const str1 = getStringWithLineNumber('');
    const str2 = getStringWithLineNumber('');
    expect(str1).toEqual('');
    expect(str2).toEqual('');
  });
  it('should return line with number if you pass non-empty string and same string if you pass string with spaces', () => {
    const getStringWithLineNumber = createGetStringWithLineIfNotEmpty();
    const str1 = getStringWithLineNumber('&');
    const str2 = getStringWithLineNumber('    ');
    expect(str1).toEqual('1&');
    expect(str2).toEqual('    ');
  });
});

describe(`${createRemoveDuplicateEmptyString.name}`, () => {
  it('should return non-empty line if you pass non-empty line', () => {
    const removeDuplicateEmptyString = createRemoveDuplicateEmptyString();

    expect(removeDuplicateEmptyString('$')).toEqual('$');
  });
  it('should not remove empty line if it goes in the middle and is not repeated', () => {
    const removeDuplicateEmptyString = createRemoveDuplicateEmptyString();
    const str1 = removeDuplicateEmptyString('4');
    const str2 = removeDuplicateEmptyString('  ');
    const str3 = removeDuplicateEmptyString('5');

    expect(str1).toEqual('4');
    expect(str2).toEqual('  ');
    expect(str3).toEqual('5');
  });
  it('should remove empty line in the middle if it goes in the middle and repeated', () => {
    const removeDuplicateEmptyString = createRemoveDuplicateEmptyString();
    const str1 = removeDuplicateEmptyString('4');
    const str2 = removeDuplicateEmptyString('  ');
    const str3 = removeDuplicateEmptyString('  ');

    const str4 = removeDuplicateEmptyString('5');

    expect(str1).toEqual('4');
    expect(str2).toEqual('  ');
    expect(str3).toEqual('');
    expect(str4).toEqual('5');
  });
  it('should remove empty line at the beginning if it goes at the beginning and repeated', () => {
    const removeDuplicateEmptyString = createRemoveDuplicateEmptyString();
    const str1 = removeDuplicateEmptyString('  ');
    const str2 = removeDuplicateEmptyString('  ');
    const str3 = removeDuplicateEmptyString('4');
    const str4 = removeDuplicateEmptyString('5');

    expect(str1).toEqual('  ');
    expect(str2).toEqual('');
    expect(str3).toEqual('4');
    expect(str4).toEqual('5');
  });
  it('should remove empty line at the end if it goes at the end and repeated', () => {
    const removeDuplicateEmptyString = createRemoveDuplicateEmptyString();

    const str1 = removeDuplicateEmptyString('4');
    const str2 = removeDuplicateEmptyString('5');
    const str3 = removeDuplicateEmptyString('  ');
    const str4 = removeDuplicateEmptyString('  ');

    expect(str1).toEqual('4');
    expect(str2).toEqual('5');
    expect(str3).toEqual('  ');
    expect(str4).toEqual('');
  });
});

describe(`${getStringWithReplacedTabs.name}`, () => {
  it('should return string with replace tabs', () => {
    expect(getStringWithReplacedTabs('abo\tbab\t')).toEqual('abo^|bab^|');
  });
});

describe(`${createProcessLineCallback.name}`, () => {
  it('should return empty line if contains deleteDuplicatesEmptyLine flag and passed strings contains duplicate empty strings', () => {
    const processLineCallback = createProcessLineCallback({
      deleteEmptyDuplicates: true,
      hasDollars: true,
      hasLines: false,
      hasNonEmptyLines: false,
      replaceTabs: true,
    });

    expect(processLineCallback('$')).toBe('$$');
    expect(processLineCallback(' ')).toBe(' $');
    expect(processLineCallback(' ')).toBe('');
    expect(processLineCallback('\tb')).toBe('^|b$');
  });
  it('should return line which contains number of line correctly if passed flag hasLines', () => {
    const processLineCallback = createProcessLineCallback({
      deleteEmptyDuplicates: false,
      hasDollars: false,
      hasLines: true,
      hasNonEmptyLines: false,
      replaceTabs: false,
    });

    expect(processLineCallback('$')).toBe('1$');
    expect(processLineCallback(' ')).toBe('2 ');
    expect(processLineCallback(' ')).toBe('3 ');
    expect(processLineCallback('\tb')).toBe('4\tb');
  });
  it('should correctly process lines if passed flag hasNonEmptyLines', () => {
    const processLineCallback = createProcessLineCallback({
      deleteEmptyDuplicates: false,
      hasDollars: false,
      hasLines: false,
      hasNonEmptyLines: true,
      replaceTabs: false,
    });

    expect(processLineCallback('$')).toBe('1$');
    expect(processLineCallback(' ')).toBe(' ');
    expect(processLineCallback(' ')).toBe(' ');
    expect(processLineCallback('\tb')).toBe('2\tb');
  });
});
