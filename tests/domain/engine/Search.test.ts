import { describe, expect, it } from 'vitest';

import { Board } from '../../../src/domain/board/Board.js';
import { Square } from '../../../src/domain/board/Square.js';
import { Position } from '../../../src/domain/game/Position.js';
import { Color } from '../../../src/domain/pieces/Color.js';
import { Piece } from '../../../src/domain/pieces/Piece.js';
import { PieceType } from '../../../src/domain/pieces/PieceType.js';
import { MoveType } from '../../../src/domain/moves/MoveType.js';
import { CompositeEvaluator } from '../../../src/domain/engine/CompositeEvaluator.js';
import { MaterialEvaluator } from '../../../src/domain/engine/MaterialEvaluator.js';
import { PositionalEvaluator } from '../../../src/domain/engine/PositionalEvaluator.js';
import { Search } from '../../../src/domain/engine/Search.js';

describe('Search', () => {
  const evaluator = new CompositeEvaluator([
    new MaterialEvaluator(),
    new PositionalEvaluator(),
  ]);

  const search = new Search(evaluator);

  it('rejects an invalid search depth', () => {
    const position = new Position();

    expect(() => search.findBestMove(position, 0)).toThrow(
      'Search depth must be a positive integer: 0',
    );
  });

  it('returns null when there are no legal moves', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('h8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('f7'),
      new Piece(Color.White, PieceType.Queen),
    );

    board.setPiece(
      Square.fromAlgebraic('g6'),
      new Piece(Color.White, PieceType.King),
    );

    const position = new Position(board, Color.Black);

    expect(search.findBestMove(position, 1)).toBeNull();
  });

  it('returns a legal move', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(board, Color.White);

    const move = search.findBestMove(position, 1);

    expect(move).not.toBeNull();
  });

  it('finds a queen capture at shallow depth', () => {
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
      Square.fromAlgebraic('d1'),
      new Piece(Color.White, PieceType.Queen),
    );

    board.setPiece(
      Square.fromAlgebraic('d8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const position = new Position(board, Color.White);

    const move = search.findBestMove(position, 1);

    expect(move).not.toBeNull();
    expect(move?.from.toAlgebraic()).toBe('d1');
    expect(move?.to.toAlgebraic()).toBe('d8');
    expect(move?.type).toBe(MoveType.Capture);
  });

  it('prefers checkmate over material', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('f6'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('g6'),
      new Piece(Color.White, PieceType.Queen),
    );

    board.setPiece(
      Square.fromAlgebraic('h8'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(board, Color.White);

    const move = search.findBestMove(position, 1);

    expect(move).not.toBeNull();
    expect(move?.from.toAlgebraic()).toBe('g6');
    expect(move?.to.toAlgebraic()).toBe('g7');
  });

  it('does not treat stalemate as a material advantage', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('h8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('f7'),
      new Piece(Color.White, PieceType.Queen),
    );

    board.setPiece(
      Square.fromAlgebraic('g6'),
      new Piece(Color.White, PieceType.King),
    );

    const position = new Position(board, Color.Black);

    expect(search.findBestMove(position, 1)).toBeNull();
  });
});
