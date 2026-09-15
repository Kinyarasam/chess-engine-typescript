import type { Move } from '../moves/Move.js';
import { MoveType } from '../moves/MoveType.js';

export class QuiescenceMoveGenerator {
  public generate(moves: readonly Move[]): Move[] {
    return moves.filter((move) => {
      return (
        move.type === MoveType.Capture ||
        move.type === MoveType.EnPassant ||
        move.type === MoveType.Promotion
      );
    });
  }
}
