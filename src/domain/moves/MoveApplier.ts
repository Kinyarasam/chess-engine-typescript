import { Square } from '../board/Square.js';
import type { Position } from '../game/Position.js';
import { Color } from '../pieces/Color.js';
import { Piece } from '../pieces/Piece.js';
import type { Move } from './Move.js';
import { MoveType } from './MoveType.js';

export class MoveApplier {
  public apply(position: Position, move: Move): void {
    switch (move.type) {
      case MoveType.Normal:
      case MoveType.Capture:
        this.applyNormalMove(position, move);
        break;

      case MoveType.Promotion:
        this.applyPromotion(position, move);
        break;

      case MoveType.EnPassant:
        this.applyEnpassant(position, move);
        break;

      case MoveType.CastlingKingSide:
        this.applyCastleKingSide(position, move);
        break;

      case MoveType.CastlingQueenSide:
        this.applyCastleQueenSide(position, move);
        break;
    }
  }

  private applyNormalMove(position: Position, move: Move): void {
    const piece = position.board.removePiece(move.from);

    if (piece === null) {
      throw new Error(
        `Cannot apply move: no piece on ${move.from.toAlgebraic()}`,
      );
    }

    position.board.removePiece(move.to);
    position.board.setPiece(move.to, piece);
  }

  private applyPromotion(position: Position, move: Move): void {
    const pawn = position.board.removePiece(move.from);

    if (pawn === null) {
      throw new Error(
        `Cannot apply promotion: no piece on ${move.from.toAlgebraic()}`,
      );
    }

    if (move.promotion === null) {
      throw new Error(`Cannot apply promotion: no promotion piece specified`);
    }

    position.board.removePiece(move.to);

    position.board.setPiece(move.to, new Piece(pawn.color, move.promotion));
  }

  private applyEnpassant(position: Position, move: Move): void {
    const pawn = position.board.removePiece(move.from);

    if (pawn === null) {
      throw new Error(
        `Cannot apply en passant: no piece on ${move.from.toAlgebraic()}`,
      );
    }

    position.board.removePiece(move.to);

    const capturedPawnSquare = Square.fromIndex(
      move.to.index + (pawn.color === Color.White ? -8 : 8),
    );

    const capturePawn = position.board.removePiece(capturedPawnSquare);

    if (capturePawn === null) {
      throw new Error(
        `cannot apply en passant: no pawn on ${capturedPawnSquare.toAlgebraic()}`,
      );
    }

    position.board.setPiece(move.to, pawn);
  }

  private applyCastleKingSide(position: Position, move: Move): void {
    const king = position.board.removePiece(move.from);
    const rookSquare = Square.fromAlgebraic(move.from.rank === 0 ? 'h1' : 'h8');
    const rookDestination = Square.fromAlgebraic(
      move.from.rank === 0 ? 'f1' : 'f8',
    );

    const rook = position.board.removePiece(rookSquare);

    if (king === null || rook === null) {
      throw new Error('Cannot apply king-side castle');
    }

    position.board.setPiece(move.to, king);
    position.board.setPiece(rookDestination, rook);
  }

  private applyCastleQueenSide(position: Position, move: Move): void {
    const king = position.board.removePiece(move.from);
    const rookSquare = Square.fromAlgebraic(move.from.rank === 0 ? 'a1' : 'a8');
    const rookDestination = Square.fromAlgebraic(
      move.from.rank === 0 ? 'd1' : 'd8',
    );

    const rook = position.board.removePiece(rookSquare);

    if (king === null || rook === null) {
      throw new Error('Cannot apply queen-side castle');
    }

    position.board.setPiece(move.to, king);
    position.board.setPiece(rookDestination, rook);
  }
}
