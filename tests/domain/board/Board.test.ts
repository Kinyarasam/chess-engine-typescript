import { describe, expect, it } from 'vitest';

import { Square } from '../../../src/domain/board/Square.js';
import { Board } from '../../../src/domain/board/Board.js';
import { Color } from '../../../src/domain/pieces/Color.js';
import { PieceType } from '../../../src/domain/pieces/PieceType.js';
import { Piece } from '../../../src/domain/pieces/Piece.js';

describe('Board', () => {
  it('starts empty', () => {
    const board = new Board();

    for (let index = 0; index < 64; index++) {
      const square = Square.fromIndex(index);
      expect(board.getPiece(square)).toBeNull();
    }
  });

  it('places a piece on a square', () => {
    const board = new Board();
    const square = Square.fromAlgebraic('e4');
    const piece = new Piece(Color.White, PieceType.King);

    board.setPiece(square, piece);

    expect(board.getPiece(square)).toBe(piece);
  });

  it('replaces an existing piece', () => {
    const board = new Board();
    const square = Square.fromAlgebraic('e4');

    const whiteKing = new Piece(Color.White, PieceType.King);
    const whiteQueen = new Piece(Color.White, PieceType.Queen);

    board.setPiece(square, whiteKing);
    board.setPiece(square, whiteQueen);

    expect(board.getPiece(square)).toBe(whiteQueen);
  });

  it('removes a piece and returns it', () => {
    const board = new Board();
    const square = Square.fromAlgebraic('e4');
    const piece = new Piece(Color.White, PieceType.King);

    board.setPiece(square, piece);

    const removed = board.removePiece(square);

    expect(removed).toBe(piece);
    expect(board.getPiece(square)).toBeNull();
  });

  it('returns null when removing an empty square', () => {
    const board = new Board();
    const square = Square.fromAlgebraic('e4');

    const removed = board.removePiece(square);

    expect(removed).toBeNull();
  });

  it('keeps pieces on different squares independent', () => {
    const board = new Board();

    const e4 = Square.fromAlgebraic('e4');
    const d5 = Square.fromAlgebraic('d5');

    const whiteKing = new Piece(Color.White, PieceType.King);
    const blackQueen = new Piece(Color.Black, PieceType.Queen);

    board.setPiece(e4, whiteKing);
    board.setPiece(d5, blackQueen);

    expect(board.getPiece(e4)).toBe(whiteKing);
    expect(board.getPiece(d5)).toBe(blackQueen);
  });
});
