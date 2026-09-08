import type { Position } from '../game/Position.js';
import type { Move } from './Move.js';
import { MoveGenerator } from './MoveGenerator.js';
import { MoveValidator } from './MoveValidator.js';

export class LegalMoveGenerator {
  private readonly moveGenerator: MoveGenerator;
  private readonly moveValidator: MoveValidator;

  public constructor(
    moveGenerator: MoveGenerator = new MoveGenerator(),
    moveValidator: MoveValidator = new MoveValidator(),
  ) {
    this.moveGenerator = moveGenerator;
    this.moveValidator = moveValidator;
  }

  public generateMoves(position: Position): Move[] {
    const pseudoLegoMoves = this.moveGenerator.generateMoves(position);

    return pseudoLegoMoves.filter((move) =>
      this.moveValidator.isLegal(position, move),
    );
  }
}
