import { describe, expect, it } from 'vitest';

import { Board } from '../../../src/domain/board/Board.js';
import { Square } from '../../../src/domain/board/Square.js';
import { Position } from '../../../src/domain/game/Position.js';
import { Move } from '../../../src/domain/moves/Move.js';
import { MoveValidator } from '../../../src/domain/moves/MoveValidator.js';
import { Color } from '../../../src/domain/pieces/Color.js';
import { Piece } from '../../../src/domain/pieces/Piece.js';
import { PieceType } from '../../../src/domain/pieces/PieceType.js';
import { MoveType } from '../../../src/domain/moves/MoveType.js';

describe('MoveValidator', () => {
  it('accepts a generated pawn move', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const from = Square.fromAlgebraic('e2');
    const to = Square.fromAlgebraic('e4');

    board.setPiece(from, new Piece(Color.White, PieceType.Pawn));

    const position = new Position(board, Color.White);

    const move = new Move(from, to);

    const validator = new MoveValidator();

    expect(validator.isLegal(position, move)).toBe(true);
  });

  it('rejects a move that is not generated', () => {
    const board = new Board();

    const from = Square.fromAlgebraic('e2');
    const to = Square.fromAlgebraic('e5');

    board.setPiece(from, new Piece(Color.White, PieceType.Pawn));

    const position = new Position(board, Color.White);

    const move = new Move(from, to);

    const validator = new MoveValidator();

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('rejects a move that exposes its own king to check', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e2'),
      new Piece(Color.White, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('e7'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const position = new Position(board, Color.White);

    const move = new Move(
      Square.fromAlgebraic('e2'),
      Square.fromAlgebraic('a2'),
    );

    const validator = new MoveValidator();

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('rejects a king move onto an attacked square', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const position = new Position(board, Color.White);

    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('e2'),
    );

    const validator = new MoveValidator();

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('accepts a king capture when the destination square is safe', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e2'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const position = new Position(board, Color.White);

    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('e2'),
      MoveType.Capture,
    );

    const validator = new MoveValidator();

    expect(validator.isLegal(position, move)).toBe(true);
  });
});
