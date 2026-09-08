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
import { CastlingRights } from '../../../src/domain/game/CastlingRights.js';

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

  it('rejects a move that captures the opposing king', () => {
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

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('e8'),
      MoveType.Capture,
    );

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('accepts a valid pawn promotion', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('d1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e7'),
      new Piece(Color.White, PieceType.Pawn),
    );

    const position = new Position(board, Color.White);

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e7'),
      Square.fromAlgebraic('e8'),
      MoveType.Promotion,
      PieceType.Queen,
    );

    expect(validator.isLegal(position, move)).toBe(true);
  });

  it('rejects promotion to a king', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('d1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e7'),
      new Piece(Color.White, PieceType.Pawn),
    );

    const position = new Position(board, Color.White);

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e7'),
      Square.fromAlgebraic('e8'),
      MoveType.Promotion,
      PieceType.King,
    );

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('rejects promotion before reaching the final rank', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('d1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e6'),
      new Piece(Color.White, PieceType.Pawn),
    );

    const position = new Position(board, Color.White);

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e6'),
      Square.fromAlgebraic('e7'),
      MoveType.Promotion,
      PieceType.Queen,
    );

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('accepts a valid en passant capture', () => {
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
      Square.fromAlgebraic('e5'),
      new Piece(Color.White, PieceType.Pawn),
    );

    board.setPiece(
      Square.fromAlgebraic('d5'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.None,
      Square.fromAlgebraic('d6'),
    );

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e5'),
      Square.fromAlgebraic('d6'),
      MoveType.EnPassant,
    );

    expect(validator.isLegal(position, move)).toBe(true);
  });

  it('rejects en passant when the target square is not available', () => {
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
      Square.fromAlgebraic('e5'),
      new Piece(Color.White, PieceType.Pawn),
    );

    board.setPiece(
      Square.fromAlgebraic('d5'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.None,
      null,
    );

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e5'),
      Square.fromAlgebraic('d6'),
      MoveType.EnPassant,
    );

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('rejects en passant when it exposes its own king to check', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e5'),
      new Piece(Color.White, PieceType.Pawn),
    );

    board.setPiece(
      Square.fromAlgebraic('d5'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.None,
      Square.fromAlgebraic('d6'),
    );

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e5'),
      Square.fromAlgebraic('d6'),
      MoveType.EnPassant,
    );

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('rejects king-side castling without castling rights', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.White, PieceType.Rook),
    );

    const position = new Position(board, Color.White, CastlingRights.None);

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('g1'),
      MoveType.CastlingKingSide,
    );

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('rejects queen-side castling without castling rights', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    const position = new Position(board, Color.White, CastlingRights.None);

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('c1'),
      MoveType.CastlingQueenSide,
    );

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('rejects castling when the king is not on its starting square', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('d1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.White, PieceType.Rook),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.WhiteKingSide,
    );

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('d1'),
      Square.fromAlgebraic('g1'),
      MoveType.CastlingKingSide,
    );

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('rejects castling when the required rook is missing', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.WhiteKingSide,
    );

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('g1'),
      MoveType.CastlingKingSide,
    );

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('rejects king-side castling when a square between the king and rook is occupied', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.White, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('f1'),
      new Piece(Color.White, PieceType.Bishop),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.WhiteKingSide,
    );

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('g1'),
      MoveType.CastlingKingSide,
    );

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('rejects queen-side castling when a square between the king and rook is occupied', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('c1'),
      new Piece(Color.White, PieceType.Knight),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.WhiteQueenSide,
    );

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('c1'),
      MoveType.CastlingQueenSide,
    );

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('rejects castling while the king is in check', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.White, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.WhiteKingSide,
    );

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('g1'),
      MoveType.CastlingKingSide,
    );

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('rejects castling through an attacked square', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.White, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('f8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.WhiteKingSide,
    );

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('g1'),
      MoveType.CastlingKingSide,
    );

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('rejects castling into an attacked square', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.White, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('g8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.WhiteKingSide,
    );

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('g1'),
      MoveType.CastlingKingSide,
    );

    expect(validator.isLegal(position, move)).toBe(false);
  });

  it('accepts valid king-side castling', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.White, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.WhiteKingSide,
    );

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('g1'),
      MoveType.CastlingKingSide,
    );

    expect(validator.isLegal(position, move)).toBe(true);
  });

  it('accepts valid queen-side castling', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    board.setPiece(
      Square.fromAlgebraic('h8'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.WhiteQueenSide,
    );

    const validator = new MoveValidator();

    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('c1'),
      MoveType.CastlingQueenSide,
    );

    expect(validator.isLegal(position, move)).toBe(true);
  });
});
