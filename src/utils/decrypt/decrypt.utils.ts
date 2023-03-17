import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import crypto from "crypto";
import inquirer from "inquirer";

import { PromptAnswer } from "../../models/prompt-answer.model.js";
import { PromptKeys } from "../../models/prompt-keys.js";

export abstract class DecryptUtils {
  static initialize(): void {
    chalkAnimation.glitch("Initializing the decryption process...", 0.5);

    setTimeout(() => {
      console.log("Decryption process initialized");
      this.askForEncryptedSeedPhraseAndKey();
    }, 2000);
  }

  static askForEncryptedSeedPhraseAndKey(): void {
    inquirer
      .prompt([
        {
          type: "input",
          name: PromptKeys.seedPhraseWord,
          message: "Please enter the encrypted seed phrase:",
          validate: (input: string) => {
            if (input.trim().length > 0) {
              return true;
            }
            return "Please enter an encrypted seed phrase!";
          },
        },
        {
          type: "input",
          name: PromptKeys.encryptionKey,
          message: "Please enter an encryption key:",
          validate: (input: string) => {
            if (input.trim().length < 8) {
              return "Encryption key must be at least 8 characters long!";
            }
            return true;
          },
        },
      ])
      .then((answers: PromptAnswer) => {
        const encryptedSeedPhrase = answers.seedPhraseWord as string;
        const encryptionKey = answers.encryptionKey as string;
        const decryptedSeedPhrase = this.decryptSeedPhrase(
          encryptedSeedPhrase,
          encryptionKey
        );

        // Display the decrypted seed phrase
        console.log(chalk.underline("\nDecrypted seed phrase:"));
        console.log(chalk.bold(decryptedSeedPhrase + "\n"));

        // Thank the user for using the app
        chalkAnimation.neon("Thank you for using the app!");

        setTimeout(() => {
          process.exit(0);
        }, 5000);
      });
  }

  static decryptSeedPhrase(
    encryptedSeedPhrase: string,
    encryptionKey: string
  ): string {
    try {
      const [encrypted, iv, salt] = encryptedSeedPhrase.split(".");
      const derivedKey = crypto.pbkdf2Sync(
        encryptionKey,
        Buffer.from(salt, "hex"),
        100000,
        32,
        "sha256"
      );
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        derivedKey,
        Buffer.from(iv, "hex")
      );
      const decrypted = decipher.update(Buffer.from(encrypted, "hex"));
      const finalBuffer = Buffer.concat([decrypted, decipher.final()]);
      const decryptedSeedPhrase = finalBuffer.toString();
      return decryptedSeedPhrase;
    } catch (error) {
      console.log(
        chalk.red(
          "There was an issue decrypting the value with the given key. Please try again!"
        )
      );
      process.exit(1);
    }
  }
}
