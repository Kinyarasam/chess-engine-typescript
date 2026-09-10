import { Square } from '../board/Square.js';
import type { Position } from '../game/Position.js';
import { Color } from '../pieces/Color.js';
import { PieceType } from '../pieces/PieceType.js';
import type { Evaluator } from './Evaluator.js';

export class MaterialEvaluator implements Evaluator {
  private static readonly PIECE_VALUES: Record<PieceType, number> = {
    [PieceType.Pawn]: 100,
    [PieceType.Knight]: 320,
    [PieceType.Bishop]: 330,
    [PieceType.Rook]: 500,
    [PieceType.Queen]: 900,
    [PieceType.King]: 0,
  };

  public evaluate(position: Position): number {
    let score = 0;

    for (let index = 0; index < 64; index++) {
      const square = Square.fromIndex(index);
      const piece = position.board.getPiece(square);

      if (piece === null) {
        continue;
      }

      const value = MaterialEvaluator.PIECE_VALUES[piece.type];

      score += piece.color === Color.White ? value : -value;
    }

    return score;
  }
}
