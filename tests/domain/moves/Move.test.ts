import { describe, expect, it } from 'vitest';

import { Square } from '../../../src/domain/board/Square.js';
import { PieceType } from '../../../src/domain/pieces/PieceType.js';
import { Move } from '../../../src/domain/moves/Move.js';
import { MoveType } from '../../../src/domain/moves/MoveType.js';

describe('Move', () => {
  const e2 = Square.fromAlgebraic('e2');
  const e4 = Square.fromAlgebraic('e4');

  it('creates a normal move', () => {
    const move = new Move(e2, e4);

    expect(move.from).toBe(e2);
    expect(move.to).toBe(e4);
    expect(move.type).toBe(MoveType.Normal);
    expect(move.promotion).toBeNull();
  });

  it('creates a capture move', () => {
    const move = new Move(e2, e4, MoveType.Capture);

    expect(move.type).toBe(MoveType.Capture);
    expect(move.promotion).toBeNull();
  });

  it('creates a king-side castling move', () => {
    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('g1'),
      MoveType.CastlingKingSide,
    );

    expect(move.type).toBe(MoveType.CastlingKingSide);
  });

  it('creates a queen-side castling move', () => {
    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('c1'),
      MoveType.CastlingQueenSide,
    );

    expect(move.type).toBe(MoveType.CastlingQueenSide);
  });

  it('creates an en passant move', () => {
    const move = new Move(
      Square.fromAlgebraic('e5'),
      Square.fromAlgebraic('d6'),
      MoveType.EnPassant,
    );

    expect(move.type).toBe(MoveType.EnPassant);
  });

  it('creates a promotion move', () => {
    const move = new Move(
      Square.fromAlgebraic('e7'),
      Square.fromAlgebraic('e8'),
      MoveType.Promotion,
      PieceType.Queen,
    );

    expect(move.type).toBe(MoveType.Promotion);
    expect(move.promotion).toBe(PieceType.Queen);
  });

  it('supports every promotion piece type except a king', () => {
    const promotionTypes = [
      PieceType.Queen,
      PieceType.Rook,
      PieceType.Bishop,
      PieceType.Knight,
    ];

    for (const promotion of promotionTypes) {
      const move = new Move(
        Square.fromAlgebraic('e7'),
        Square.fromAlgebraic('e8'),
        MoveType.Promotion,
        promotion,
      );

      expect(move.promotion).toBe(promotion);
    }
  });

  it('rejects a promotion without a promotion piece', () => {
    expect(() => new Move(e2, e4, MoveType.Promotion)).toThrow();
  });

  it('rejects a promotion piece on a non-promotion move', () => {
    expect(() => new Move(e2, e4, MoveType.Normal, PieceType.Queen)).toThrow();
  });
});
