import { describe, expect, it } from 'vitest';

import { Board } from '../../src/domain/board/Board.js';
import { Square } from '../../src/domain/board/Square.js';
import { Color } from '../../src/domain/pieces/Color.js';
import { Piece } from '../../src/domain/pieces/Piece.js';
import { PieceType } from '../../src/domain/pieces/PieceType.js';
import { CastlingRights } from '../../src/domain/game/CastlingRights.js';
import { Position } from '../../src/domain/game/Position.js';
import { FenParser } from '../../src/infrastructure/fen/FenParser.js';
import { FenSerializer } from '../../src/infrastructure/fen/FenSerializer.js';

describe('FenSerializer', () => {
  it('serializes the standard starting position', () => {
    const position = FenParser.parse(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    );

    const fen = FenSerializer.serialize(position);

    expect(fen).toBe(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    );
  });

  it('serializes an empty board', () => {
    const position = new Position();

    const fen = FenSerializer.serialize(position);

    expect(fen).toBe('8/8/8/8/8/8/8/8 w - - 0 1');
  });

  it('serializes white pieces using uppercase symbols', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    expect(FenSerializer.serialize(position)).toBe(
      '8/8/8/8/8/8/8/R3K3 w - - 0 1',
    );
  });

  it('serializes black pieces using lowercase symbols', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    expect(FenSerializer.serialize(position)).toBe(
      'r3k3/8/8/8/8/8/8/8 w - - 0 1',
    );
  });

  it('serializes all castling rights', () => {
    const position = new Position(
      new Board(),
      Color.White,
      CastlingRights.WhiteKingSide |
        CastlingRights.WhiteQueenSide |
        CastlingRights.BlackKingSide |
        CastlingRights.BlackQueenSide,
    );

    expect(FenSerializer.serialize(position)).toContain(' KQkq ');
  });

  it('serializes no castling rights as a dash', () => {
    const position = new Position();

    expect(FenSerializer.serialize(position)).toContain(' - - 0 1');
  });

  it('serializes an en passant square', () => {
    const position = new Position(
      new Board(),
      Color.Black,
      CastlingRights.None,
      Square.fromAlgebraic('e3'),
    );

    expect(FenSerializer.serialize(position)).toBe(
      '8/8/8/8/8/8/8/8 b - e3 0 1',
    );
  });

  it('serializes move counters', () => {
    const position = new Position(
      new Board(),
      Color.White,
      CastlingRights.None,
      null,
      37,
      42,
    );

    expect(FenSerializer.serialize(position)).toBe(
      '8/8/8/8/8/8/8/8 w - - 37 42',
    );
  });

  it('round trips the standard starting position', () => {
    const original = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    const position = FenParser.parse(original);
    const serialized = FenSerializer.serialize(position);

    expect(serialized).toBe(original);
  });

  it('round trips a complex position', () => {
    const original =
      'r3k2r/pppq1ppp/2np1n2/8/2B5/2NP1Q2/PPP2PPP/R3K2R b KQkq - 7 18';

    const position = FenParser.parse(original);
    const serialized = FenSerializer.serialize(position);

    expect(serialized).toBe(original);
  });
});
