import { Position } from '../game/Position.js';
import { MoveGenerator } from './MoveGenerator.js';
import { Move } from './Move.js';
import { MoveApplier } from './MoveApplier.js';
import { CheckDetector } from '../game/CheckDetector.js';
import { Square } from '../board/Square.js';
import { Board } from '../board/Board.js';

export class MoveValidator {
  private readonly moveGenerator: MoveGenerator;
  private readonly moveApplier: MoveApplier;
  private readonly checkDetector: CheckDetector;

  public constructor(
    moveGenerator: MoveGenerator = new MoveGenerator(),
    moveApplier: MoveApplier = new MoveApplier(),
    checkDetector: CheckDetector = new CheckDetector(),
  ) {
    this.moveGenerator = moveGenerator;
    this.moveApplier = moveApplier;
    this.checkDetector = checkDetector;
  }

  public isLegal(position: Position, move: Move): boolean {
    if (!this.isGeneratedMove(position, move)) {
      return false;
    }

    const temporaryPosition = this.createTemporaryPosition(position);

    this.moveApplier.apply(temporaryPosition, move);

    return !this.checkDetector.isInCheck(
      temporaryPosition,
      position.sideToMove,
    );
  }

  private isGeneratedMove(position: Position, move: Move): boolean {
    const generatedMoves = this.moveGenerator.generateMoves(position);

    return generatedMoves.some(
      (generatedMove) =>
        generatedMove.from.index === move.from.index &&
        generatedMove.to.index === move.to.index &&
        generatedMove.type === move.type &&
        generatedMove.promotion === move.promotion,
    );
  }

  private createTemporaryPosition(position: Position): Position {
    const board = new Board();

    for (let index = 0; index < 64; index++) {
      const square = Square.fromIndex(index);
      const piece = position.board.getPiece(square);

      if (piece !== null) {
        board.setPiece(square, piece);
      }
    }

    return new Position(
      board,
      position.sideToMove,
      position.castlingRights,
      position.enPassantSquare,
      position.halfmoveClock,
      position.fullmoveNumber,
    );
  }
}
