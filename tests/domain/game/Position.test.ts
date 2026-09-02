import { describe, expect, it } from 'vitest';

import { Board } from '../../../src/domain/board/Board.js';
import { Square } from '../../../src/domain/board/Square.js';
import { Color } from '../../../src/domain/pieces/Color.js';
import { CastlingRights } from '../../../src/domain/game/CastlingRights.js';
import { Position } from '../../../src/domain/game/Position.js';

describe('Position', () => {
  it('creates an empty position with sensible defaults', () => {
    const position = new Position();

    expect(position.board).toBeInstanceOf(Board);
    expect(position.sideToMove).toBe(Color.White);
    expect(position.castlingRights).toBe(CastlingRights.None);
    expect(position.enPassantSquare).toBeNull();
    expect(position.halfmoveClock).toBe(0);
    expect(position.fullmoveNumber).toBe(1);
  });

  it('accepts a custom board', () => {
    const board = new Board();
    const square = Square.fromAlgebraic('e4');

    const position = new Position(board);

    expect(position.board).toBe(board);
    expect(position.board.getPiece(square)).toBeNull();
  });

  it('accepts Black as the side to move', () => {
    const position = new Position(new Board(), Color.Black);

    expect(position.sideToMove).toBe(Color.Black);
  });

  it('stores castling rights', () => {
    const rights = CastlingRights.WhiteKingSide | CastlingRights.BlackQueenSide;

    const position = new Position(new Board(), Color.White, rights);

    expect(position.castlingRights).toBe(rights);
  });

  it('stores the en passant square', () => {
    const square = Square.fromAlgebraic('e3');

    const position = new Position(
      new Board(),
      Color.Black,
      CastlingRights.None,
      square,
    );

    expect(position.enPassantSquare).toBe(square);
  });

  it('stores the halfmove clock and fullmove number', () => {
    const position = new Position(
      new Board(),
      Color.White,
      CastlingRights.None,
      null,
      12,
      37,
    );

    expect(position.halfmoveClock).toBe(12);
    expect(position.fullmoveNumber).toBe(37);
  });

  it('rejects a negative halfmove clock', () => {
    expect(
      () =>
        new Position(new Board(), Color.White, CastlingRights.None, null, -1),
    ).toThrow(RangeError);
  });

  it('rejects a zero fullmove number', () => {
    expect(
      () =>
        new Position(new Board(), Color.White, CastlingRights.None, null, 0, 0),
    ).toThrow(RangeError);
  });

  it('rejects non-integer move counters', () => {
    expect(
      () =>
        new Position(
          new Board(),
          Color.White,
          CastlingRights.None,
          null,
          1.5,
          1,
        ),
    ).toThrow(RangeError);
  });
});
