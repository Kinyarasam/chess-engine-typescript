import { Position } from '../game/Position.js';
import type { Move } from '../moves/Move.js';
import type { Evaluator } from './Evaluator.js';
import { LegalMoveGenerator } from '../moves/LegalMoveGenerator.js';
import { MoveApplier } from '../moves/MoveApplier.js';
import { Color } from '../pieces/Color.js';
import { PositionCloner } from '../game/PositionCloner.js';

export class Search {
  private readonly evaluator: Evaluator;
  private readonly legalMoveGenerator: LegalMoveGenerator;
  private readonly moveApplier: MoveApplier;

  public constructor(
    evaluator: Evaluator,
    legalMoveGenerator: LegalMoveGenerator = new LegalMoveGenerator(),
    moveApplier: MoveApplier = new MoveApplier(),
  ) {
    this.evaluator = evaluator;
    this.legalMoveGenerator = legalMoveGenerator;
    this.moveApplier = moveApplier;
  }

  public findBestMove(position: Position, depth: number): Move | null {
    if (!Number.isInteger(depth) || depth < 1) {
      throw new RangeError(`Search depth must be a positive integer: ${depth}`);
    }

    const legalMoves = this.legalMoveGenerator.generateMoves(position);

    if (legalMoves.length === 0) {
      return null;
    }

    let bestMove = legalMoves[0];
    if (bestMove === undefined) {
      throw new Error('Expected at least one legal move');
    }

    let bestScore = -Infinity;

    for (const move of legalMoves) {
      const nextPosition = PositionCloner.clone(position);

      this.moveApplier.apply(nextPosition, move);

      nextPosition.sideToMove = this.getOpponent(position.sideToMove);

      const score = -this.negamax(nextPosition, depth - 1);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  private negamax(position: Position, depth: number): number {
    if (depth === 0) {
      return this.evaluateForSideToMove(position);
    }

    const legalMoves = this.legalMoveGenerator.generateMoves(position);

    if (legalMoves.length === 0) {
      return this.evaluateForSideToMove(position);
    }

    let bestScore = -Infinity;

    for (const move of legalMoves) {
      const nextPosition = PositionCloner.clone(position);

      this.moveApplier.apply(nextPosition, move);

      nextPosition.sideToMove = this.getOpponent(position.sideToMove);

      const score = -this.negamax(nextPosition, depth - 1);

      bestScore = Math.max(bestScore, score);
    }

    return bestScore;
  }

  private evaluateForSideToMove(position: Position): number {
    const score = this.evaluator.evaluate(position);

    return position.sideToMove === Color.White ? score : -score;
  }

  private getOpponent(color: Color): Color {
    return color === Color.White ? Color.Black : Color.White;
  }
}
