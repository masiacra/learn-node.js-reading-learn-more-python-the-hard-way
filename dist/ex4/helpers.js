'use strict';
import { ARGUMENT } from './constants';
const getFullCLIVariableName = (variableName) => `--${variableName}`;
const getAbbreaviatedVariableName = (variableName) => `-${variableName[0]}`;
const createGetBooleanValue = (variableName) => {
    const fullName = getFullCLIVariableName(variableName);
    const abbreaviatedName = getAbbreaviatedVariableName(variableName);
    return (arg) => {
        return arg === fullName || arg === abbreaviatedName;
    };
};
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
            const value = arg.split('=')[1];
            if (!value) {
                throw new Error(`Usage ${fullName}=value`);
            }
            return value;
        }
        if (arg.includes(abbreaviatedName)) {
            const value = arg.split('=')[1];
            if (!value) {
                throw new Error(`Usage ${abbreaviatedName}=value`);
            }
            return value;
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
export const ADDITIONAL_CLI_ARGS = [
    { callback: containsForce, argumentName: ARGUMENT.force, initialValue: false },
    { callback: containsWatch, argumentName: ARGUMENT.watch, initialValue: false },
    { callback: containsServe, argumentName: ARGUMENT.serve, initialValue: false },
    { callback: getDevtoolIfExists, argumentName: ARGUMENT.devtool, initialValue: false },
    { callback: getModeIfExists, argumentName: ARGUMENT.mode, initialValue: false },
    { callback: getTemplateIfExists, argumentName: ARGUMENT.template, initialValue: false },
];
export const getCLIVariables = (cliArgumentsRecord) => (args) => {
    var _a;
    const variables = {
        [ARGUMENT.help]: false,
    };
    cliArgumentsRecord.forEach(({ callback, argumentName, initialValue }) => {
        variables[argumentName] = { callback, value: initialValue, files: null };
    });
    let previousArgument = null;
    for (let i = 0; i < args.length; i++) {
        const cur = args[i];
        if (containsHelp(cur)) {
            variables.help = true;
            break;
        }
        let value;
        const argumentName = (_a = cliArgumentsRecord.find(({ callback, argumentName }) => {
            const tmpValue = callback(cur);
            if (tmpValue) {
                value = tmpValue;
            }
            return !!tmpValue;
        })) === null || _a === void 0 ? void 0 : _a.argumentName;
        if (value && argumentName) {
            variables[argumentName].value = value;
            previousArgument = argumentName;
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
