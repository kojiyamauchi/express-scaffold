/*
 Common Module.ts
*/

// Import Modules.
// Add Path Here.

export default class Module {
  // Types.
  private readonly letter: number

  public constructor(arg: string) {
    // Add Constructor.
    this.letter = arg
  }

  public core(): void {
    console.info(this.letter)
  }
}
