import { describe, expect, it } from 'vitest';
import { MaterialEvaluator } from '../../../src/domain/engine/MaterialEvaluator';
import { Board } from '../../../src/domain/board/Board';
import { Square } from '../../../src/domain/board/Square';
import { Piece } from '../../../src/domain/pieces/Piece';
import { Color } from '../../../src/domain/pieces/Color';
import { PieceType } from '../../../src/domain/pieces/PieceType';
import { Position } from '../../../src/domain/game/Position';
import { QuiescenceSearch } from '../../../src/domain/engine/QuiescenceSearch';

describe('QuiescenceSearch', () => {
  const evaluator = new MaterialEvaluator();

  it('evaluates a quiet position directly', () => {
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

    const search = new QuiescenceSearch(evaluator);

    expect(search.evaluate(position)).toBe(0);
  });

  it('searches captures before evaluating a position', () => {
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

    const search = new QuiescenceSearch(evaluator);

    expect(search.evaluate(position)).toBeGreaterThan(0);
  });

  it('searches a profitable capture before evaluating', () => {
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
      Square.fromAlgebraic('h4'),
      new Piece(Color.White, PieceType.Bishop),
    );

    board.setPiece(
      Square.fromAlgebraic('d8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const position = new Position(board, Color.White);

    const search = new QuiescenceSearch(evaluator);

    const score = search.evaluate(position);

    expect(score).toBe(1_230);
  });
  it('does not allow stand-pat when the side to move is in check', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e3'),
      new Piece(Color.Black, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(board, Color.White);

    const evaluator = {
      evaluate: (currentPosition: Position): number =>
        currentPosition.board.getPiece(Square.fromAlgebraic('e1')) !== null
          ? 0
          : 100,
    };

    const search = new QuiescenceSearch(evaluator);

    expect(search.evaluate(position)).toBe(100);
  });

  it('returns a mate score when the side to move is checkmated', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('g2'),
      new Piece(Color.Black, PieceType.Queen),
    );

    board.setPiece(
      Square.fromAlgebraic('f3'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(board, Color.White);

    const search = new QuiescenceSearch(evaluator);

    expect(search.evaluate(position)).toBe(-100_000);
  });

  it('returns a draw score when the side to move is stalemated', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('f2'),
      new Piece(Color.Black, PieceType.Queen),
    );

    board.setPiece(
      Square.fromAlgebraic('g3'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(board, Color.White);

    const search = new QuiescenceSearch(evaluator);

    expect(search.evaluate(position)).toBe(0);
  });
});
