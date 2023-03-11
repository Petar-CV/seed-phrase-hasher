import { PromptKeys } from "./prompt-keys.js";

export type PromptAnswer = Object & {
  [key in PromptKeys]: string;
};
