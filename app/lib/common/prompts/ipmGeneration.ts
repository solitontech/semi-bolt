import type { PromptOptions } from '~/lib/common/prompt-library';

export const getIPMPrompt = (options: PromptOptions) => {
  const { cwd, allowedHtmlElements } = options;
  return `instrument panel generation prompt`;
};
