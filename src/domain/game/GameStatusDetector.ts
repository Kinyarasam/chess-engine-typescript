import { LegalMoveGenerator } from '../moves/LegalMoveGenerator.js';
import { CheckDetector } from './CheckDetector.js';
import { GameStatus } from './GameStatus.js';
import { InsufficientMaterialDetector } from './InsufficientMaterialDetector.js';
import type { Position } from './Position.js';

export class GameStatusDetector {
  private readonly checkDetector: CheckDetector;
  private readonly legalMoveGenerator: LegalMoveGenerator;
  private readonly insufficientMaterialDetector: InsufficientMaterialDetector;

  public constructor(
    checkDetector: CheckDetector = new CheckDetector(),
    legalMoveGenerator: LegalMoveGenerator = new LegalMoveGenerator(),
    insufficientMaterialDetector: InsufficientMaterialDetector = new InsufficientMaterialDetector(),
  ) {
    this.checkDetector = checkDetector;
    this.legalMoveGenerator = legalMoveGenerator;
    this.insufficientMaterialDetector = insufficientMaterialDetector;
  }

  public getStatus(position: Position): GameStatus {
    const sideToMove = position.sideToMove;
    const inCheck = this.checkDetector.isInCheck(position, sideToMove);

    const hasLegalMoves =
      this.legalMoveGenerator.generateMoves(position).length > 0;

    if (!hasLegalMoves) {
      return inCheck ? GameStatus.Checkmate : GameStatus.Stalemate;
    }

    if (this.insufficientMaterialDetector.isInsufficientMaterial(position)) {
      return GameStatus.DrawByInsufficientMaterial;
    }

    if (position.halfmoveClock >= 100) {
      return GameStatus.DrawByFiftyMove;
    }

    return inCheck ? GameStatus.Check : GameStatus.InProgress;
  }
}
