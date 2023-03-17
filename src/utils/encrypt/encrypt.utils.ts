import chalkAnimation from "chalk-animation";
import inquirer, { Question } from "inquirer";
import crypto from "crypto";

import { PromptKeys } from "../../models/prompt-keys.js";
import { PromptAnswer } from "../../models/prompt-answer.model.js";
import chalk, { chalkStderr } from "chalk";

export abstract class EncryptUtils {
  static initialize(): void {
    chalkAnimation.glitch("Initializing the encryption process...", 0.5);

    setTimeout(() => {
      console.log("Encryption process initialized");
      this.askForSeedPhraseLength();
    }, 2000);
  }

  static askForSeedPhraseLength(): void {
    inquirer
      .prompt([
        {
          type: "list",
          name: PromptKeys.seedPhraseLength,
          message: "How many words does your seed phrase contain?",
          choices: [12, 18, 24],
        },
      ])
      .then((answers: PromptAnswer) => {
        this.askForSeedPhraseAndEncryptionKey(
          answers.seedPhraseLength as number
        );
      });
  }

  static askForSeedPhraseAndEncryptionKey(seedPhraseLength: number): void {
    // Ask for seed phrase one word at a time
    const seedPhraseQuestions: Question[] = [];

    // Ask for each word in the seed phrase
    for (let i = 0; i < seedPhraseLength; i++) {
      seedPhraseQuestions.push({
        type: "input",
        name: `${PromptKeys.seedPhraseWord}${i}`,
        message: `Please enter word ${i + 1}:`,
        validate: (input: string) => {
          if (input.trim().length > 0) {
            return true;
          }
          return "Please enter a word!";
        },
      });
    }

    // Ask for the encryption key
    seedPhraseQuestions.push({
      type: "input",
      name: PromptKeys.encryptionKey,
      message: "Please enter an encryption key:",
      validate: (input: string) => {
        if (input.trim().length < 8) {
          return "Encryption key must be at least 8 characters long!";
        }
        return true;
      },
    });

    inquirer.prompt(seedPhraseQuestions).then((answers: PromptAnswer) => {
      const encryptionKey = answers.encryptionKey as string;

      // Create a seed phrase string from the answers
      let seedPhrase = "";
      for (let i = 0; i < seedPhraseLength; i++) {
        seedPhrase += answers[PromptKeys.seedPhraseWord + i] + " ";
      }
      seedPhrase = seedPhrase.trim();

      // Encrypt the seed phrase
      const encryptedSeedPhrase = this.encryptSeedPhrase(
        seedPhrase,
        encryptionKey
      );

      // Display the encrypted seed phrase
      console.log(chalk.underline("\nEncrypted seed phrase:"));
      console.log(chalk.bold(encryptedSeedPhrase + "\n"));

      // Thank the user for using the app
      chalkAnimation.neon("\nThank you for using the app!\n");

      setTimeout(() => {
        process.exit(0);
      }, 5000);
    });
  }

  static encryptSeedPhrase(seedPhrase: string, encryptionKey: string): string {
    const salt = crypto.randomBytes(16);
    const derivedKey = crypto.pbkdf2Sync(
      encryptionKey,
      salt,
      100000,
      32,
      "sha256"
    );
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", derivedKey, iv);
    const encrypted = cipher.update(seedPhrase);
    const finalBuffer = Buffer.concat([encrypted, cipher.final()]);
    const encryptedSeedPhrase = `${finalBuffer.toString("hex")}.${iv.toString(
      "hex"
    )}.${salt.toString("hex")}`;
    return encryptedSeedPhrase;
  }
}
