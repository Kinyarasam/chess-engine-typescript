import { describe, expect, it } from 'vitest';

import { Square } from '../../../src/domain/board/Square.js';
import { Position } from '../../../src/domain/game/Position.js';
import { Color } from '../../../src/domain/pieces/Color.js';
import { Piece } from '../../../src/domain/pieces/Piece.js';
import { PieceType } from '../../../src/domain/pieces/PieceType.js';
import { PositionalEvaluator } from '../../../src/domain/engine/PositionalEvaluator.js';
import { PIECE_SQUARE_TABLES } from '../../../src/domain/engine/PieceSquareTable.js';

describe('PositionalEvaluator', () => {
  const evaluator = new PositionalEvaluator();

  it('returns zero for an empty position', () => {
    const position = new Position();

    expect(evaluator.evaluate(position)).toBe(0);
  });

  it('uses the white piece-square value directly', () => {
    const position = new Position();

    const square = Square.fromAlgebraic('c3');

    position.board.setPiece(square, new Piece(Color.White, PieceType.Knight));

    expect(evaluator.evaluate(position)).toBe(
      PIECE_SQUARE_TABLES[PieceType.Knight][square.index],
    );
  });

  it('mirrors the table for black pieces', () => {
    const position = new Position();

    const square = Square.fromAlgebraic('c6');
    const mirroredIndex = (7 - square.rank) * 8 + square.file;

    position.board.setPiece(square, new Piece(Color.Black, PieceType.Knight));

    expect(evaluator.evaluate(position)).toBe(
      -PIECE_SQUARE_TABLES[PieceType.Knight][mirroredIndex],
    );
  });

  it('evaluates equal mirrored positions equally', () => {
    const whitePosition = new Position();

    whitePosition.board.setPiece(
      Square.fromAlgebraic('c3'),
      new Piece(Color.White, PieceType.Knight),
    );

    const blackPosition = new Position();

    blackPosition.board.setPiece(
      Square.fromAlgebraic('c6'),
      new Piece(Color.Black, PieceType.Knight),
    );

    expect(evaluator.evaluate(whitePosition)).toBe(
      -evaluator.evaluate(blackPosition),
    );
  });

  it('combines positional values for multiple pieces', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('c3'),
      new Piece(Color.White, PieceType.Knight),
    );

    position.board.setPiece(
      Square.fromAlgebraic('f6'),
      new Piece(Color.White, PieceType.Bishop),
    );

    const knightValue =
      PIECE_SQUARE_TABLES[PieceType.Knight][Square.fromAlgebraic('c3').index];

    const bishopValue =
      PIECE_SQUARE_TABLES[PieceType.Bishop][Square.fromAlgebraic('f6').index];

    expect(evaluator.evaluate(position)).toBe(knightValue + bishopValue);
  });
});
