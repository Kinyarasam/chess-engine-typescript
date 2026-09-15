import { CheckDetector } from '../game/CheckDetector.js';
import type { Position } from '../game/Position.js';
import { PositionCloner } from '../game/PositionCloner.js';
import { PositionTransition } from '../game/PositionTransition.js';
import { LegalMoveGenerator } from '../moves/LegalMoveGenerator.js';
import type { Move } from '../moves/Move.js';
import { Color } from '../pieces/Color.js';
import type { Evaluator } from './Evaluator.js';
import { QuiescenceMoveGenerator } from './QuiescenceMoveGenerator.js';
import { SearchScore } from './SearchScore.js';

export class QuiescenceSearch {
  private readonly evaluator: Evaluator;
  private readonly legalMoveGenerator: LegalMoveGenerator;
  private readonly quiescenceMoveGenerator: QuiescenceMoveGenerator;
  private readonly positionTransition: PositionTransition;
  private readonly checkDetector: CheckDetector;

  public constructor(
    evaluator: Evaluator,
    legalMoveGenerator: LegalMoveGenerator = new LegalMoveGenerator(),
    quiescenceMoveGenerator: QuiescenceMoveGenerator = new QuiescenceMoveGenerator(),
    positionTransition: PositionTransition = new PositionTransition(),
    checkDetector: CheckDetector = new CheckDetector(),
  ) {
    this.evaluator = evaluator;
    this.legalMoveGenerator = legalMoveGenerator;
    this.quiescenceMoveGenerator = quiescenceMoveGenerator;
    this.positionTransition = positionTransition;
    this.checkDetector = checkDetector;
  }

  public evaluate(position: Position): number {
    return this.quiescence(position);
  }

  private quiescence(position: Position): number {
    const legalMoves = this.legalMoveGenerator.generateMoves(position);

    const inCheck = this.checkDetector.isInCheck(position, position.sideToMove);

    if (legalMoves.length === 0) {
      return inCheck ? -SearchScore.MATE : SearchScore.DRAW;
    }

    if (inCheck) {
      return this.searchMoves(position, legalMoves);
    }

    const standPat = this.evaluateForSideToMove(position);

    const tacticalMoves = this.quiescenceMoveGenerator.generate(legalMoves);

    if (tacticalMoves.length === 0) {
      return standPat;
    }

    return Math.max(standPat, this.searchMoves(position, tacticalMoves));
  }

  private evaluateForSideToMove(position: Position): number {
    const score = this.evaluator.evaluate(position);

    return position.sideToMove === Color.White ? score : -score;
  }

  private searchMoves(position: Position, moves: readonly Move[]): number {
    let bestScore = -Infinity;

    for (const move of moves) {
      const nextPosition = PositionCloner.clone(position);

      this.positionTransition.apply(nextPosition, move);

      const score = -this.quiescence(nextPosition);

      bestScore = Math.max(bestScore, score);
    }

    return bestScore;
  }
}
