import type { Position } from '../game/Position.js';
import type { Move } from './Move.js';
import { MoveType } from './MoveType.js';

export class MoveApplier {
  public apply(position: Position, move: Move): void {
    if (move.type !== MoveType.Normal && move.type !== MoveType.Capture) {
      throw new Error(`Move type ${move.type} is not supported yet`);
    }

    const piece = position.board.removePiece(move.from);

    if (piece === null) {
      throw new Error(
        `Cannot apply move: no piece on ${move.from.toAlgebraic()}`,
      );
    }

    position.board.removePiece(move.to);
    position.board.setPiece(move.to, piece);
  }
}
