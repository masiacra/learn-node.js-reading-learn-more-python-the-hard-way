"use strict";
/*
  Small utility which should parse command line arguments.
*/

// 1. It should process situation of getting help when using --help or -h.

const containsHelp = (arg) => arg === "--help" || arg === "-h";

// 2. It should process as minimum three flags, i.e. they don't take any additional
// arguments, but their usage turn on something.
// 2.1. It should set flag watch by use --watch or -w.
// 2.2. It should set flag serve by use --serve or -s.
// 2.3. It should set flag force by use --force or -f.
const containsWatch = (arg) => arg === "--watch" || arg === "-w";

const containsServe = (arg) => arg === "--serve" || arg === "-s";

const containsForce = (arg) => arg === "--force" || arg === "-f";
// 3. It should process as minimum three options, i.e. they take argument and set
// my variables in code equal to these argument.
// 3.1. It should set variable template by use --template or -t. For example, --template=default.
// 3.2. It should set variable devtool by use --devtool or -d. For example, --devtool=none.
// 3.3. It should set variable mode by use --mode or -m. For example, --mode=production.
const TEMPLATE = "--template=";
const ABBREVIATED_TEMPLATE = "-t=";
const getTemplateIfExists = (arg) => {
  if (arg.includes(TEMPLATE)) {
    return arg.split(TEMPLATE)[1];
  }

  if (arg.includes(ABBREVIATED_TEMPLATE)) {
    return arg.split(ABBREVIATED_TEMPLATE)[1];
  }
  return null;
};

const DEVTOOL = "--devtool=";
const ABBREVIATED_DEVTOOL = "-d=";
const getDevtoolIfExists = (arg) => {
  if (arg.includes(DEVTOOL)) {
    return arg.split(DEVTOOL)[1];
  }

  if (arg.includes(ABBREVIATED_DEVTOOL)) {
    return arg.split(ABBREVIATED_DEVTOOL)[1];
  }
  return null;
};

const MODE = "--mode=";
const ABBREVIATED_MODE = "-m=";
const getModeIfExists = (arg) => {
  if (arg.includes(MODE)) {
    return arg.split(MODE)[1];
  }

  if (arg.includes(ABBREVIATED_MODE)) {
    return arg.split(ABBREVIATED_MODE)[1];
  }
  return null;
};

// 4. It should process additional "positional" arguments, which are lists of files at
// the end of all arguments of type -, and capable of handling terminal wildcards, such as */.txt.
// То есть, тут возможна передача после любого из моих аргументов командной строки.

// Wildcards:
// * - замена нуля или любого количества символов.
// ? - замена одного символа.
// [] - замена определенного набора символов.

const ARGUMENT = {
  mode: "mode",
  devtool: "devtool",
  template: "template",
  watch: "watch",
  serve: "serve",
  force: "force",
};

const defineVariables = (args) => {
  const variables = {
    help: null,
    force: { flag: false, files: null },
    serve: { flag: false, files: null },
    watch: { flag: false, files: null },
    devtool: { value: null, files: null },
    mode: { value: null, files: null },
    template: { value: null, files: null },
  };
  let previousArgument = null;

  for (let i = 0; i < args.length; i++) {
    const cur = args[i];

    if (containsHelp(cur)) {
      variables.help = true;
      break;
    }
    if (containsForce(cur)) {
      variables.force.flag = true;
      previousArgument = ARGUMENT.force;
      continue;
    }
    if (containsWatch(cur)) {
      variables.watch.flag = true;
      previousArgument = ARGUMENT.watch;
      continue;
    }
    if (containsServe(cur)) {
      variables.serve.flag = true;
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

const main = () => {
  const args = process.argv.slice(2);

  const variables = defineVariables(args);

  console.log(variables);
};

main();
