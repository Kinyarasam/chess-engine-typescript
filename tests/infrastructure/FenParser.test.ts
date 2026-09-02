import { describe, expect, it } from 'vitest';

import { Square } from '../../src/domain/board/Square.js';
import { Color } from '../../src/domain/pieces/Color.js';
import { PieceType } from '../../src/domain/pieces/PieceType.js';
import { CastlingRights } from '../../src/domain/game/CastlingRights.js';
import { FenParser } from '../../src/infrastructure/fen/FenParser.js';

describe('FenParser', () => {
  it('parses the standard starting position', () => {
    const position = FenParser.parse(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    );

    expect(position.sideToMove).toBe(Color.White);
    expect(position.castlingRights).toBe(
      CastlingRights.WhiteKingSide |
        CastlingRights.WhiteQueenSide |
        CastlingRights.BlackKingSide |
        CastlingRights.BlackQueenSide,
    );
    expect(position.enPassantSquare).toBeNull();
    expect(position.halfmoveClock).toBe(0);
    expect(position.fullmoveNumber).toBe(1);
  });

  it('parses pieces onto their correct squares', () => {
    const position = FenParser.parse(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    );

    const a1 = position.board.getPiece(Square.fromAlgebraic('a1'));
    const e1 = position.board.getPiece(Square.fromAlgebraic('e1'));
    const e8 = position.board.getPiece(Square.fromAlgebraic('e8'));
    const h8 = position.board.getPiece(Square.fromAlgebraic('h8'));

    expect(a1?.color).toBe(Color.White);
    expect(a1?.type).toBe(PieceType.Rook);

    expect(e1?.color).toBe(Color.White);
    expect(e1?.type).toBe(PieceType.King);

    expect(e8?.color).toBe(Color.Black);
    expect(e8?.type).toBe(PieceType.King);

    expect(h8?.color).toBe(Color.Black);
    expect(h8?.type).toBe(PieceType.Rook);
  });

  it('parses black to move', () => {
    const position = FenParser.parse('8/8/8/8/8/8/8/4k2K b - - 0 42');

    expect(position.sideToMove).toBe(Color.Black);
    expect(position.fullmoveNumber).toBe(42);
  });

  it('parses an en passant square', () => {
    const position = FenParser.parse(
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
    );

    expect(position.enPassantSquare).toEqual(Square.fromAlgebraic('e6'));
  });

  it('parses individual castling rights', () => {
    const position = FenParser.parse('8/8/8/8/8/8/8/4k2K w Qq - 12 37');

    expect(position.castlingRights).toBe(
      CastlingRights.WhiteQueenSide | CastlingRights.BlackQueenSide,
    );

    expect(position.halfmoveClock).toBe(12);
    expect(position.fullmoveNumber).toBe(37);
  });

  it('parses an empty board', () => {
    const position = FenParser.parse('8/8/8/8/8/8/8/8 w - - 0 1');

    for (let index = 0; index < 64; index += 1) {
      expect(position.board.getPiece(Square.fromIndex(index))).toBeNull();
    }
  });

  it('rejects FEN with the wrong number of fields', () => {
    expect(() => FenParser.parse('8/8/8/8/8/8/8/8 w -')).toThrow();
  });

  it('rejects an invalid side to move', () => {
    expect(() => FenParser.parse('8/8/8/8/8/8/8/8 x - - 0 1')).toThrow();
  });

  it('rejects an invalid board', () => {
    expect(() => FenParser.parse('9/8/8/8/8/8/8/8 w - - 0 1')).toThrow();
  });
});
