// import { CheckDetector } from '../game/CheckDetector.js';
import type { Position } from '../game/Position.js';
// import { PositionCloner } from '../game/PositionCloner.js';
// import { PositionTransition } from '../game/PositionTransition.js';
import type { Move } from '../moves/Move.js';
import { MoveType } from '../moves/MoveType.js';
// import { Color } from '../pieces/Color.js';
import { PieceType } from '../pieces/PieceType.js';

export class MoveOrdering {
  //   private readonly positionTransition: PositionTransition;
  //   private readonly checkDetector: CheckDetector;

  public constructor(
    // positionalTransition: PositionTransition = new PositionTransition(),
    // checkDetector: CheckDetector = new CheckDetector(),
  ) {
    // this.positionTransition = positionalTransition;
    // this.checkDetector = checkDetector;
  }

  public order(position: Position, moves: readonly Move[]): Move[] {
    return [...moves].sort(
      (first, second) =>
        this.getScore(position, second) - this.getScore(position, first),
    );
  }

  private getScore(position: Position, move: Move): number {
    let score = 0;

    score += this.getPromotionScore(move);
    score += this.getCaptureScore(position, move);
    // score += this.getCheckScore(position, move);

    return score;
  }

  private getPromotionScore(move: Move): number {
    if (move.type !== MoveType.Promotion) {
      return 0;
    }

    return 10_000;
  }

  private getCaptureScore(position: Position, move: Move): number {
    if (move.type !== MoveType.Capture && move.type !== MoveType.EnPassant) {
      return 0;
    }

    const attacker = position.board.getPiece(move.from);

    if (attacker === null) {
      return 0;
    }

    const victim =
      move.type === MoveType.EnPassant
        ? PieceType.Pawn
        : position.board.getPiece(move.to)?.type;

    if (victim === undefined) {
      return 0;
    }

    return (
      5_000 + this.getPieceValue(victim) - this.getPieceValue(attacker.type)
    );
  }

  //   private getCheckScore(position: Position, move: Move): number {
  //     const nextPosition = PositionCloner.clone(position);

  //     this.positionTransition.apply(nextPosition, move);

  //     const opponent =
  //       position.sideToMove === Color.White ? Color.Black : Color.White;

  //     return this.checkDetector.isInCheck(nextPosition, opponent) ? 2_000 : 0;
  //   }

  private getPieceValue(pieceType: PieceType): number {
    switch (pieceType) {
      case PieceType.Pawn:
        return 100;
      case PieceType.Rook:
        return 500;
      case PieceType.Knight:
        return 320;
      case PieceType.Bishop:
        return 330;
      case PieceType.Queen:
        return 900;
      case PieceType.King:
        return 20_000;
    }
  }
}
