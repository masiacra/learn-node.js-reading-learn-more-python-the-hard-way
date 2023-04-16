export const ARGUMENT: Readonly<Record<string, string>> = {
  mode: 'mode',
  devtool: 'devtool',
  template: 'template',
  watch: 'watch',
  serve: 'serve',
  force: 'force',
  help: 'help',
};

export const HELP_TEXT = `ex4, version 0.0.1

usage: node ex4 [-wfs] (additional positional arguments) [-dtm]=(value) (additional positional arguments)

available options:
  ${Object.keys(ARGUMENT)
    .map((key) => `--${key} or -${key[0]}`)
    .join(', ')}
`;
