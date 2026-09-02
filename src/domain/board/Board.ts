import { Piece } from '../pieces/Piece.js';
import { Square } from './Square.js';

export class Board {
  private readonly squares: Array<Piece | null>;

  public constructor() {
    this.squares = Array<Piece | null>(64).fill(null);
  }

  public getPiece(square: Square): Piece | null {
    return this.squares[square.index] ?? null;
  }

  public setPiece(square: Square, piece: Piece | null): void {
    this.squares[square.index] = piece;
  }

  public removePiece(square: Square): Piece | null {
    const piece = this.squares[square.index] ?? null;

    this.squares[square.index] = null;

    return piece;
  }
}
