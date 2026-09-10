import { Square } from '../board/Square.js';
import { CastlingRights } from './CastlingRights.js';
import { Position } from './Position.js';
import { Color } from '../pieces/Color.js';
import { PieceType } from '../pieces/PieceType.js';
import type { Piece } from '../pieces/Piece.js';
import { Move } from '../moves/Move.js';
import { MoveType } from '../moves/MoveType.js';
import { MoveApplier } from '../moves/MoveApplier.js';

export class PositionTransition {
  private readonly moveApplier: MoveApplier;

  public constructor(moveApplier: MoveApplier = new MoveApplier()) {
    this.moveApplier = moveApplier;
  }

  public apply(position: Position, move: Move): void {
    const movingPiece = position.board.getPiece(move.from);

    if (movingPiece === null) {
      throw new Error(
        `Cannot transition position: no piece on ${move.from.toAlgebraic()}`,
      );
    }

    const capturedPiece = this.getCapturedPiece(position, move, movingPiece);

    this.updateEnPassantSquare(position, move, movingPiece.type);

    this.updateHalfmoveClock(
      position,
      movingPiece.type,
      capturedPiece !== null,
    );

    this.updateCastlingRights(
      position,
      move,
      movingPiece.type,
      movingPiece.color,
      capturedPiece,
    );

    this.moveApplier.apply(position, move);

    if (movingPiece.color === Color.Black) {
      position.fullmoveNumber += 1;
    }

    position.sideToMove = this.getOpponent(movingPiece.color);
  }

  private getCapturedPiece(
    position: Position,
    move: Move,
    movingPiece: Piece,
  ): Piece | null {
    if (move.type !== MoveType.EnPassant) {
      return position.board.getPiece(move.to);
    }

    const capturedPawnIndex =
      move.to.index + (movingPiece.color === Color.White ? -8 : 8);

    const capturedPawnSquare = Square.fromIndex(capturedPawnIndex);

    return position.board.getPiece(capturedPawnSquare);
  }

  private updateEnPassantSquare(
    position: Position,
    move: Move,
    movingPieceType: PieceType,
  ): void {
    position.enPassantSquare = null;

    if (movingPieceType !== PieceType.Pawn) {
      return;
    }

    const rankDifference = Math.abs(move.to.rank - move.from.rank);

    if (rankDifference !== 2) {
      return;
    }

    const middleRank = (move.from.rank + move.to.rank) / 2;

    position.enPassantSquare = Square.fromIndex(
      middleRank * 8 + move.from.file,
    );
  }

  private updateHalfmoveClock(
    position: Position,
    movingPieceType: PieceType,
    isCapture: boolean,
  ): void {
    if (movingPieceType === PieceType.Pawn || isCapture) {
      position.halfmoveClock = 0;
      return;
    }

    position.halfmoveClock += 1;
  }

  private updateCastlingRights(
    position: Position,
    move: Move,
    pieceType: PieceType,
    color: Color,
    capturedPiece: Piece | null,
  ): void {
    if (pieceType === PieceType.King) {
      this.removeCastlingRightsForKing(position, color);
    }

    if (pieceType === PieceType.Rook) {
      this.removeCastlingRightForRookSquare(position, move.from);
    }

    if (capturedPiece?.type === PieceType.Rook) {
      this.removeCastlingRightForRookSquare(position, move.to);
    }
  }

  private removeCastlingRightsForKing(position: Position, color: Color): void {
    if (color === Color.White) {
      position.castlingRights &= ~(
        CastlingRights.WhiteKingSide | CastlingRights.WhiteQueenSide
      );
      return;
    }

    position.castlingRights &= ~(
      CastlingRights.BlackKingSide | CastlingRights.BlackQueenSide
    );
  }

  private removeCastlingRightForRookSquare(
    position: Position,
    square: Square,
  ): void {
    switch (square.toAlgebraic()) {
      case 'a1':
        position.castlingRights &= ~CastlingRights.WhiteQueenSide;
        break;

      case 'h1':
        position.castlingRights &= ~CastlingRights.WhiteKingSide;
        break;

      case 'a8':
        position.castlingRights &= ~CastlingRights.BlackQueenSide;
        break;

      case 'h8':
        position.castlingRights &= ~CastlingRights.BlackKingSide;
        break;
    }
  }

  private getOpponent(color: Color): Color {
    return color === Color.White ? Color.Black : Color.White;
  }
}
