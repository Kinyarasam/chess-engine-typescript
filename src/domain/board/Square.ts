export class Square {
  private static readonly BOARD_SIZE = 8;
  private static readonly TOTAL_SQUARES = Square.BOARD_SIZE * Square.BOARD_SIZE;

  public readonly index: number;

  private constructor(index: number) {
    if (index < 0 || index >= Square.TOTAL_SQUARES) {
      throw new Error(`Invalid square index: ${index}`);
    }
    this.index = index;
  }

  public static fromIndex(index: number): Square {
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= Square.TOTAL_SQUARES
    ) {
      throw new RangeError(`Invalid square index: ${index}`);
    }
    return new Square(index);
  }

  public static fromAlgebraic(algebraic: string): Square {
    if (!/^[a-h][1-8]$/.test(algebraic)) {
      throw new RangeError(`Invalid algebraic square: ${algebraic}`);
    }

    const file = algebraic.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = Number(algebraic[1]) - 1;

    return new Square(rank * Square.BOARD_SIZE + file);
  }

  public get file(): number {
    return this.index % Square.BOARD_SIZE;
  }

  public get rank(): number {
    return Math.floor(this.index / Square.BOARD_SIZE);
  }

  public toAlgebraic(): string {
    const file = String.fromCharCode('a'.charCodeAt(0) + this.file);

    const rank = String(this.rank + 1);
    return `${file}${rank}`;
  }
}
