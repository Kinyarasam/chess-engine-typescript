import { Square } from '../board/Square.js';
import { Color } from '../pieces/Color.js';
import { Position } from '../game/Position.js';
import { PIECE_SQUARE_TABLES } from './PieceSquareTable.js';
import type { Evaluator } from './Evaluator.js';

export class PositionalEvaluator implements Evaluator {
  public evaluate(position: Position): number {
    let score = 0;

    for (let index = 0; index < 64; index++) {
      const square = Square.fromIndex(index);
      const piece = position.board.getPiece(square);

      if (piece === null) {
        continue;
      }

      const table = PIECE_SQUARE_TABLES[piece.type];
      const tableIndex =
        piece.color === Color.White
          ? square.index
          : this.getMirroredIndex(square);

      const value = table[tableIndex];

      if (value === undefined) {
        throw new Error(
          `No positional value for square ${square.toAlgebraic()}`,
        );
      }

      score += piece.color === Color.White ? value : -value;
    }

    return score;
  }

  private getMirroredIndex(square: Square): number {
    const mirroredRank = 7 - square.rank;

    return mirroredRank * 8 + square.file;
  }
}
