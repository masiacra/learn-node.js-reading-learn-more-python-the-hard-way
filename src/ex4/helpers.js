'use strict';
const { ARGUMENT } = require('./constants');

const getFullCLIVariableName = (variableName) => `--${variableName}`;
const getAbbreaviatedVariableName = (variableName) => `-${variableName[0]}`;

const createGetBooleanValue = (variableName) => (arg) =>
  arg === getFullCLIVariableName(variableName) || getAbbreaviatedVariableName(variableName);

// 1. It should process situation of getting help when using --help or -h.
const containsHelp = createGetBooleanValue(ARGUMENT.help);

// 2. It should process as minimum three flags, i.e. they don't take any additional
// arguments, but their usage turn on something.
// 2.1. It should set flag watch by use --watch or -w.
// 2.2. It should set flag serve by use --serve or -s.
// 2.3. It should set flag force by use --force or -f.
// const containsWatch = (arg) => arg === '--watch' || arg === '-w';
const containsWatch = createGetBooleanValue(ARGUMENT.watch);

const containsServe = createGetBooleanValue(ARGUMENT.serve);

const containsForce = createGetBooleanValue(ARGUMENT.force);
// 3. It should process as minimum three options, i.e. they take argument and set
// my variables in code equal to these argument.
// 3.1. It should set variable template by use --template or -t. For example, --template=default.
// 3.2. It should set variable devtool by use --devtool or -d. For example, --devtool=none.
// 3.3. It should set variable mode by use --mode or -m. For example, --mode=production.
const createGetStringValue = (variableName) => {
  const fullName = getFullCLIVariableName(variableName);
  const abbreaviatedName = getAbbreaviatedVariableName(variableName);

  return (arg) => {
    if (arg.includes(fullName)) {
      return arg.split(fullName)[1];
    }

    if (arg.includes(abbreaviatedName)) {
      return arg.split(abbreaviatedName)[1];
    }
    return null;
  };
};

const getTemplateIfExists = createGetStringValue(ARGUMENT.template);
const getDevtoolIfExists = createGetStringValue(ARGUMENT.devtool);
const getModeIfExists = createGetStringValue(ARGUMENT.mode);

// 4. It should process additional "positional" arguments, which are lists of files at
// the end of all arguments of type -, and capable of handling terminal wildcards, such as */.txt.
// То есть, тут возможна передача после любого из моих аргументов командной строки.

// Wildcards:
// * - замена нуля или любого количества символов.
// ? - замена одного символа.
// [] - замена определенного набора символов.

const getCLIVariables = (args) => {
  const variables = {
    [ARGUMENT.help]: null,
    [ARGUMENT.force]: { value: false, files: null },
    [ARGUMENT.serve]: { value: false, files: null },
    [ARGUMENT.watch]: { value: false, files: null },
    [ARGUMENT.devtool]: { value: null, files: null },
    [ARGUMENT.mode]: { value: null, files: null },
    [ARGUMENT.template]: { value: null, files: null },
  };

  let previousArgument = null;

  for (let i = 0; i < args.length; i++) {
    const cur = args[i];

    if (containsHelp(cur)) {
      variables.help = true;
      break;
    }
    if (containsForce(cur)) {
      variables.force.value = true;
      previousArgument = ARGUMENT.force;
      continue;
    }
    if (containsWatch(cur)) {
      variables.watch.value = true;
      previousArgument = ARGUMENT.watch;
      continue;
    }
    if (containsServe(cur)) {
      variables.serve.value = true;
      previousArgument = ARGUMENT.serve;
      continue;
    }

    const devtool = getDevtoolIfExists(cur);
    if (devtool) {
      variables.devtool.value = devtool;
      previousArgument = ARGUMENT.devtool;
      continue;
    }

    const mode = getModeIfExists(cur);
    if (mode) {
      variables.mode.value = mode;
      previousArgument = ARGUMENT.mode;
      continue;
    }

    const template = getTemplateIfExists(cur);
    if (template) {
      variables.template.value = template;
      previousArgument = ARGUMENT.template;
      continue;
    }

    if (!!previousArgument) {
      if (!variables[previousArgument].files) {
        variables[previousArgument].files = [];
      }

      variables[previousArgument].files.push(cur);
    }
  }

  return variables;
};

module.exports = {
  getCLIVariables,
};
