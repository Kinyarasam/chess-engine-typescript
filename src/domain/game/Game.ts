import { Position } from './Position.js';
import { Move } from '../moves/Move.js';
import { MoveApplier } from '../moves/MoveApplier.js';
import { MoveValidator } from '../moves/MoveValidator.js';
import { Color } from '../pieces/Color.js';
import { PieceType } from '../pieces/PieceType.js';
import { Square } from '../board/Square.js';
import { CastlingRights } from './CastlingRights.js';
import type { Piece } from '../pieces/Piece.js';
import { RepetitionTracker } from './RepetitionTracker.js';

export class Game {
  private readonly moveValidator: MoveValidator;
  private readonly moveApplier: MoveApplier;
  private readonly history: Move[];
  private readonly repetitionTracker: RepetitionTracker;

  public readonly position: Position;

  public constructor(
    position: Position = new Position(),
    moveValidator: MoveValidator = new MoveValidator(),
    moveApplier: MoveApplier = new MoveApplier(),
  ) {
    this.position = position;
    this.moveValidator = moveValidator;
    this.moveApplier = moveApplier;
    this.repetitionTracker = new RepetitionTracker(this.position);
    this.history = [];
  }

  public play(move: Move): void {
    if (!this.moveValidator.isLegal(this.position, move)) {
      throw new Error(
        `Illegal move: ${move.from.toAlgebraic()}-${move.to.toAlgebraic()}`,
      );
    }

    const movingPiece = this.position.board.getPiece(move.from);
    const capturedPiece = this.position.board.getPiece(move.to);
    const movingColor = this.position.sideToMove;

    if (movingPiece === null) {
      throw new Error(
        `Cannot play move: no piece on ${move.from.toAlgebraic()}`,
      );
    }

    this.updateEnPassantSquare(move, movingPiece.type);
    this.updateHalfmoveClock(movingPiece.type, capturedPiece !== null);

    this.moveApplier.apply(this.position, move);

    this.updateCastlingRights(
      move,
      movingPiece.type,
      movingPiece.color,
      capturedPiece,
    );

    if (movingColor === Color.Black) {
      this.position.fullmoveNumber += 1;
    }

    this.position.sideToMove =
      movingColor === Color.White ? Color.Black : Color.White;

    this.repetitionTracker.record(this.position);

    this.history.push(move);
  }

  public getPosition(): Position {
    return this.position;
  }

  public getHistory(): readonly Move[] {
    return this.history;
  }

  private updateEnPassantSquare(move: Move, movingPieceType: PieceType): void {
    this.position.enPassantSquare = null;

    if (movingPieceType !== PieceType.Pawn) {
      return;
    }

    const rankDifference = Math.abs(move.to.rank - move.from.rank);

    if (rankDifference === 2) {
      const middleRank = (move.from.rank + move.to.rank) / 2;

      this.position.enPassantSquare = Square.fromIndex(
        middleRank * 8 + move.from.file,
      );
    }
  }

  private updateHalfmoveClock(
    movingPieceType: PieceType,
    isCapture: boolean,
  ): void {
    if (movingPieceType === PieceType.Pawn || isCapture) {
      this.position.halfmoveClock = 0;
      return;
    }

    this.position.halfmoveClock += 1;
  }

  private updateCastlingRights(
    move: Move,
    pieceType: PieceType,
    color: Color,
    capturedPiece: Piece | null,
  ): void {
    if (pieceType === PieceType.King) {
      if (color === Color.White) {
        this.position.castlingRights &= ~(
          CastlingRights.WhiteKingSide | CastlingRights.WhiteQueenSide
        );
      } else {
        this.position.castlingRights &= ~(
          CastlingRights.BlackKingSide | CastlingRights.BlackQueenSide
        );
      }
    }

    if (pieceType === PieceType.Rook) {
      this.removeCastlingRightForRookSquare(move.from);
    }

    if (capturedPiece?.type === PieceType.Rook) {
      this.removeCastlingRightForRookSquare(move.to);
    }
  }

  private removeCastlingRightForRookSquare(square: Square): void {
    switch (square.toAlgebraic()) {
      case 'a1':
        this.position.castlingRights &= ~CastlingRights.WhiteQueenSide;
        break;

      case 'h1':
        this.position.castlingRights &= ~CastlingRights.WhiteKingSide;
        break;

      case 'a8':
        this.position.castlingRights &= ~CastlingRights.BlackQueenSide;
        break;

      case 'h8':
        this.position.castlingRights &= ~CastlingRights.BlackKingSide;
        break;
    }
  }

  public isThreefoldRepetition(): boolean {
    return this.repetitionTracker.isThreefoldRepetition(this.position);
  }
}
