import { describe, expect, it } from 'vitest';

import { Board } from '../../../src/domain/board/Board.js';
import { Square } from '../../../src/domain/board/Square.js';
import { Color } from '../../../src/domain/pieces/Color.js';
import { Piece } from '../../../src/domain/pieces/Piece.js';
import { PieceType } from '../../../src/domain/pieces/PieceType.js';
import { CastlingRights } from '../../../src/domain/game/CastlingRights.js';
import { Position } from '../../../src/domain/game/Position.js';
import { PositionCloner } from '../../../src/domain/game/PositionCloner.js';

describe('PositionCloner', () => {
  it('clones an empty position', () => {
    const position = new Position();

    const clone = PositionCloner.clone(position);

    expect(clone).not.toBe(position);
    expect(clone.board).not.toBe(position.board);
    expect(clone.sideToMove).toBe(position.sideToMove);
    expect(clone.castlingRights).toBe(position.castlingRights);
    expect(clone.enPassantSquare).toBeNull();
    expect(clone.halfmoveClock).toBe(position.halfmoveClock);
    expect(clone.fullmoveNumber).toBe(position.fullmoveNumber);
  });

  it('clones all pieces', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('d8'),
      new Piece(Color.Black, PieceType.Queen),
    );

    const position = new Position(board);

    const clone = PositionCloner.clone(position);

    const originalKing = position.board.getPiece(Square.fromAlgebraic('e1'));

    const clonedKing = clone.board.getPiece(Square.fromAlgebraic('e1'));

    const originalQueen = position.board.getPiece(Square.fromAlgebraic('d8'));

    const clonedQueen = clone.board.getPiece(Square.fromAlgebraic('d8'));

    expect(clonedKing).not.toBe(originalKing);
    expect(clonedKing?.color).toBe(Color.White);
    expect(clonedKing?.type).toBe(PieceType.King);

    expect(clonedQueen).not.toBe(originalQueen);
    expect(clonedQueen?.color).toBe(Color.Black);
    expect(clonedQueen?.type).toBe(PieceType.Queen);
  });

  it('clones position metadata', () => {
    const enPassantSquare = Square.fromAlgebraic('e6');

    const position = new Position(
      new Board(),
      Color.Black,
      CastlingRights.WhiteKingSide | CastlingRights.BlackQueenSide,
      enPassantSquare,
      42,
      17,
    );

    const clone = PositionCloner.clone(position);

    expect(clone.sideToMove).toBe(Color.Black);
    expect(clone.castlingRights).toBe(
      CastlingRights.WhiteKingSide | CastlingRights.BlackQueenSide,
    );
    expect(clone.enPassantSquare).not.toBe(position.enPassantSquare);
    expect(clone.enPassantSquare?.toAlgebraic()).toBe('e6');
    expect(clone.halfmoveClock).toBe(42);
    expect(clone.fullmoveNumber).toBe(17);
  });

  it('does not share the board with the original', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    const position = new Position(board);
    const clone = PositionCloner.clone(position);

    clone.board.setPiece(
      Square.fromAlgebraic('d1'),
      new Piece(Color.White, PieceType.Queen),
    );

    expect(position.board.getPiece(Square.fromAlgebraic('d1'))).toBeNull();
  });
});
