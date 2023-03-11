import chalkAnimation from "chalk-animation";

export class EncryptUtils {
  static initialize(): void {
    chalkAnimation.glitch("Initializing the encryption process...", 0.5);

    setTimeout(() => {
      console.log("Encryption process initialized");
    }, 2000);
  }

  static encrypt(data: string): string {
    return "Encrypted";
  }
}
