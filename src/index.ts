#!/usr/bin/env node

import inquirer from "inquirer";

import { SeedPhraseAction } from "./models/seed-phrase-action.types.js";
import { PromptKeys } from "./models/prompt-keys.js";
import { PromptAnswer } from "./models/prompt-answer.model.js";
import { EncryptUtils } from "./utils/encrypt/encrypt.utils.js";
import { DecryptUtils } from "./utils/decrypt/decrypt.utils.js";

inquirer
  .prompt([
    {
      type: "list",
      name: PromptKeys.seedPhraseAction,
      message: "What do you want to do?",
      choices: [SeedPhraseAction.encrypt, SeedPhraseAction.decrypt],
    },
  ])
  .then((answers: PromptAnswer) => {
    switch (answers.seedPhraseAction) {
      case SeedPhraseAction.encrypt:
        EncryptUtils.initialize();
        break;
      case SeedPhraseAction.decrypt:
        DecryptUtils.initialize();
        break;
    }
  });
