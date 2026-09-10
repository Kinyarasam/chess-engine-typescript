import { Position } from '../game/Position.js';
import type { Move } from '../moves/Move.js';
import type { Evaluator } from './Evaluator.js';
import { LegalMoveGenerator } from '../moves/LegalMoveGenerator.js';
import { Color } from '../pieces/Color.js';
import { PositionCloner } from '../game/PositionCloner.js';
import { CheckDetector } from '../game/CheckDetector.js';
import { SearchScore } from './SearchScore.js';
import { PositionTransition } from '../game/PositionTransition.js';

export class Search {
  private readonly evaluator: Evaluator;
  private readonly legalMoveGenerator: LegalMoveGenerator;
  private readonly checkDetector: CheckDetector;
  private readonly positionTransition: PositionTransition;

  public constructor(
    evaluator: Evaluator,
    legalMoveGenerator: LegalMoveGenerator = new LegalMoveGenerator(),
    positionTransition: PositionTransition = new PositionTransition(),
    checkDetector: CheckDetector = new CheckDetector(),
  ) {
    this.evaluator = evaluator;
    this.legalMoveGenerator = legalMoveGenerator;
    this.positionTransition = positionTransition;
    this.checkDetector = checkDetector;
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

      this.positionTransition.apply(nextPosition, move);

      const score = -this.negamax(nextPosition, depth - 1, 1);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  private negamax(position: Position, depth: number, ply: number): number {
    const legalMoves = this.legalMoveGenerator.generateMoves(position);

    if (legalMoves.length === 0) {
      return this.getTerminalScore(position, ply);
    }

    if (depth === 0) {
      return this.evaluateForSideToMove(position);
    }

    let bestScore = -Infinity;

    for (const move of legalMoves) {
      const nextPosition = PositionCloner.clone(position);

      this.positionTransition.apply(nextPosition, move);

      const score = -this.negamax(nextPosition, depth - 1, ply + 1);

      bestScore = Math.max(bestScore, score);
    }

    return bestScore;
  }

  private evaluateForSideToMove(position: Position): number {
    const score = this.evaluator.evaluate(position);

    return position.sideToMove === Color.White ? score : -score;
  }

  private getTerminalScore(position: Position, ply: number): number {
    const inCheck = this.checkDetector.isInCheck(position, position.sideToMove);

    if (!inCheck) {
      return SearchScore.DRAW;
    }

    return -SearchScore.MATE + ply;
  }
}
