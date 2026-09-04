import { Square } from '../board/Square.js';
import { AttackDetector } from '../moves/AttackDetector.js';
import { Color } from '../pieces/Color.js';
import { PieceType } from '../pieces/PieceType.js';
import type { Position } from './Position.js';

export class CheckDetector {
  private readonly attackDetector: AttackDetector;

  public constructor(attackDetector: AttackDetector = new AttackDetector()) {
    this.attackDetector = attackDetector;
  }

  public isInCheck(position: Position, color: Color): boolean {
    const kingSquare = this.findKing(position, color);

    return this.attackDetector.isSquareAttacked(
      position,
      kingSquare,
      color === Color.White ? Color.Black : Color.White,
    );
  }

  private findKing(position: Position, color: Color): Square {
    for (let index = 0; index < 64; index++) {
      const square = Square.fromIndex(index);
      const piece = position.board.getPiece(square);

      if (
        piece !== null &&
        piece.color === color &&
        piece.type === PieceType.King
      ) {
        return square;
      }
    }

    throw new Error(`Position has no ${color} king`);
  }
}
