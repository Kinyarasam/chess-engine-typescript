import { describe, expect, it } from 'vitest';
import { Move } from '../../../src/domain/moves/Move.js';
import { MoveType } from '../../../src/domain/moves/MoveType.js';
import { Square } from '../../../src/domain/board/Square.js';
import { QuiescenceMoveGenerator } from '../../../src/domain/engine/QuiescenceMoveGenerator.js';
import { PieceType } from '../../../src/domain/pieces/PieceType.js';

describe('QuiescenceMoveGenerator', () => {
  const from = Square.fromAlgebraic('e2');
  const to = Square.fromAlgebraic('e4');

  it('keeps captures', () => {
    const move = new Move(from, to, MoveType.Capture);

    const generator = new QuiescenceMoveGenerator();

    expect(generator.generate([move])).toEqual([move]);
  });

  it('keeps en passant captures', () => {
    const move = new Move(from, to, MoveType.EnPassant);

    const generator = new QuiescenceMoveGenerator();

    expect(generator.generate([move])).toEqual([move]);
  });

  it('keeps promotions', () => {
    const move = new Move(
      Square.fromAlgebraic('e7'),
      Square.fromAlgebraic('e8'),
      MoveType.Promotion,
      PieceType.Queen,
    );

    const generator = new QuiescenceMoveGenerator();

    expect(generator.generate([move])).toEqual([move]);
  });

  it('removes quiet moves', () => {
    const move = new Move(from, to, MoveType.Normal);

    const generator = new QuiescenceMoveGenerator();

    expect(generator.generate([move])).toEqual([]);
  });
});
