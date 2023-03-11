import chalkAnimation from "chalk-animation";

export class DecryptUtils {
  static initialize(): void {
    chalkAnimation.glitch("Initializing the decryption process...", 0.5);

    setTimeout(() => {
      console.log("Decryption process initialized");
    }, 2000);
  }

  static decrypt(data: string): string {
    return "Decrypted";
  }
}
