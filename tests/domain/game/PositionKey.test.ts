import { describe, expect, it } from 'vitest';
import { Position } from '../../../src/domain/game/Position';
import { PositionKey } from '../../../src/domain/game/PositionKey';
import { Board } from '../../../src/domain/board/Board';
import { Square } from '../../../src/domain/board/Square';
import { Piece } from '../../../src/domain/pieces/Piece';
import { Color } from '../../../src/domain/pieces/Color';
import { PieceType } from '../../../src/domain/pieces/PieceType';
import { CastlingRights } from '../../../src/domain/game/CastlingRights';

describe('PositionKey', () => {
  const createPosition = (): Position => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    return new Position(
      board,
      Color.White,
      CastlingRights.WhiteKingSide,
      null,
      0,
      1,
    );
  };

  it('generates the same key for the same position', () => {
    const first = createPosition();
    const second = createPosition();

    expect(PositionKey.from(first)).toBe(PositionKey.from(second));
  });

  it('generates different keys for different sides to move', () => {
    const first = createPosition();
    const second = createPosition();

    second.sideToMove = Color.Black;

    expect(PositionKey.from(first)).not.toBe(PositionKey.from(second));
  });

  it('generates different keys for different castling rights', () => {
    const first = createPosition();
    const second = createPosition();

    second.castlingRights = CastlingRights.None;

    expect(PositionKey.from(first)).not.toBe(PositionKey.from(second));
  });

  it('generates different keys for different en passant squares', () => {
    const first = createPosition();
    const second = createPosition();

    second.enPassantSquare = Square.fromAlgebraic('e3');

    expect(PositionKey.from(first)).not.toBe(PositionKey.from(second));
  });

  it('ignores the halfmove clock', () => {
    const first = createPosition();
    const second = createPosition();

    first.halfmoveClock = 10;
    second.halfmoveClock = 80;

    expect(PositionKey.from(first)).toBe(PositionKey.from(second));
  });

  it('ignores the fullmove number', () => {
    const first = createPosition();
    const second = createPosition();

    first.fullmoveNumber = 10;
    second.fullmoveNumber = 80;

    expect(PositionKey.from(first)).toBe(PositionKey.from(second));
  });

  it('generates different keys for different piece types', () => {
    const kingPosition = createPosition();
    kingPosition.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    const knightPosition = createPosition();
    knightPosition.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.Knight),
    );

    expect(PositionKey.from(kingPosition)).not.toBe(
      PositionKey.from(knightPosition),
    );
  });
});
