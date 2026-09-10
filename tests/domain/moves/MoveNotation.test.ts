import { describe, expect, it } from 'vitest';

import { MoveNotation } from '../../../src/domain/moves/MoveNotation';
import { Move } from '../../../src/domain/moves/Move';
import { Square } from '../../../src/domain/board/Square';
import { MoveType } from '../../../src/domain/moves/MoveType';
import { PieceType } from '../../../src/domain/pieces/PieceType';
import { Piece } from '../../../src/domain/pieces/Piece';
import { Color } from '../../../src/domain/pieces/Color';
import { Position } from '../../../src/domain/game/Position';

describe('MoveNotation', () => {
  const notation = new MoveNotation();

  it('formats a normal move', () => {
    const move = new Move(
      Square.fromAlgebraic('e2'),
      Square.fromAlgebraic('e4'),
    );

    expect(notation.toCoordinateNotation(move)).toBe('e2-e4');
  });

  it('formats a capture', () => {
    const move = new Move(
      Square.fromAlgebraic('e4'),
      Square.fromAlgebraic('d5'),
      MoveType.Capture,
    );

    expect(notation.toCoordinateNotation(move)).toBe('e4-d5');
  });

  it('formats a king-side castling move', () => {
    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('g1'),
      MoveType.CastlingKingSide,
    );

    expect(notation.toCoordinateNotation(move)).toBe('e1-g1');
  });

  it('formats a queen-side castling move', () => {
    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('c1'),
      MoveType.CastlingQueenSide,
    );

    expect(notation.toCoordinateNotation(move)).toBe('e1-c1');
  });

  it('formats a promotion', () => {
    const move = new Move(
      Square.fromAlgebraic('e7'),
      Square.fromAlgebraic('e8'),
      MoveType.Promotion,
      PieceType.Queen,
    );

    expect(notation.toCoordinateNotation(move)).toBe('e7-e8=Q');
  });

  it('formats a knight promotion', () => {
    const move = new Move(
      Square.fromAlgebraic('e7'),
      Square.fromAlgebraic('e8'),
      MoveType.Promotion,
      PieceType.Knight,
    );

    expect(notation.toCoordinateNotation(move)).toBe('e7-e8=N');
  });

  it('formats a rook promotion', () => {
    const move = new Move(
      Square.fromAlgebraic('e7'),
      Square.fromAlgebraic('e8'),
      MoveType.Promotion,
      PieceType.Rook,
    );

    expect(notation.toCoordinateNotation(move)).toBe('e7-e8=R');
  });

  it('formats a bishop promotion', () => {
    const move = new Move(
      Square.fromAlgebraic('e7'),
      Square.fromAlgebraic('e8'),
      MoveType.Promotion,
      PieceType.Bishop,
    );

    expect(notation.toCoordinateNotation(move)).toBe('e7-e8=B');
  });

  it('formats a pawn move in SAN', () => {
    const position = new Position();
    position.board.setPiece(
      Square.fromAlgebraic('e2'),
      new Piece(Color.White, PieceType.Pawn),
    );

    // White king
    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    // Black king
    position.board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const move = new Move(
      Square.fromAlgebraic('e2'),
      Square.fromAlgebraic('e4'),
    );

    expect(notation.toSan(position, move)).toBe('e4');
  });

  it('formats a knight move in SAN', () => {
    const position = new Position();
    position.board.setPiece(
      Square.fromAlgebraic('g1'),
      new Piece(Color.White, PieceType.Knight),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    // Black king
    position.board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const move = new Move(
      Square.fromAlgebraic('g1'),
      Square.fromAlgebraic('f3'),
    );

    expect(notation.toSan(position, move)).toBe('Nf3');
  });

  it('formats a bishop move in SAN', () => {
    const position = new Position();
    position.board.setPiece(
      Square.fromAlgebraic('c1'),
      new Piece(Color.White, PieceType.Bishop),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    // Black king
    position.board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const move = new Move(
      Square.fromAlgebraic('c1'),
      Square.fromAlgebraic('b2'),
    );

    expect(notation.toSan(position, move)).toBe('Bb2');
  });

  it('formats a queen move in SAN', () => {
    const position = new Position();
    position.board.setPiece(
      Square.fromAlgebraic('d1'),
      new Piece(Color.White, PieceType.Queen),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    // Black king
    position.board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const move = new Move(
      Square.fromAlgebraic('d1'),
      Square.fromAlgebraic('h5'),
    );

    expect(notation.toSan(position, move)).toBe('Qh5+');
  });

  it('formats a pawn capture in SAN', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('e4'),
      new Piece(Color.White, PieceType.Pawn),
    );

    position.board.setPiece(
      Square.fromAlgebraic('d5'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    // White king
    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    // Black king
    position.board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const move = new Move(
      Square.fromAlgebraic('e4'),
      Square.fromAlgebraic('d5'),
      MoveType.Capture,
    );

    expect(notation.toSan(position, move)).toBe('exd5');
  });

  it('formats a piece capture in SAN', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('g1'),
      new Piece(Color.White, PieceType.Knight),
    );

    position.board.setPiece(
      Square.fromAlgebraic('f3'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    // Black king
    position.board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const move = new Move(
      Square.fromAlgebraic('g1'),
      Square.fromAlgebraic('f3'),
      MoveType.Capture,
    );

    expect(notation.toSan(position, move)).toBe('Nxf3');
  });

  it('formats king-side castling in SAN', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    // Black king
    position.board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    position.board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.White, PieceType.Rook),
    );

    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('g1'),
      MoveType.CastlingKingSide,
    );

    expect(notation.toSan(position, move)).toBe('O-O');
  });

  it('formats queen-side castling in SAN', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    // Black king
    position.board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    position.board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );
    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('c1'),
      MoveType.CastlingQueenSide,
    );

    expect(notation.toSan(position, move)).toBe('O-O-O');
  });

  it('formats a pawn promotion in SAN', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('e7'),
      new Piece(Color.White, PieceType.Pawn),
    );

    // Black king
    position.board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.Black, PieceType.King),
    );

    // White king
    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    const move = new Move(
      Square.fromAlgebraic('e7'),
      Square.fromAlgebraic('e8'),
      MoveType.Promotion,
      PieceType.Queen,
    );

    expect(notation.toSan(position, move)).toBe('e8=Q');
  });

  it('formats a pawn capture promotion in SAN', () => {
    const position = new Position();

    // White king
    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );
    // Black king
    position.board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.Black, PieceType.King),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e7'),
      new Piece(Color.White, PieceType.Pawn),
    );

    position.board.setPiece(
      Square.fromAlgebraic('d8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const move = new Move(
      Square.fromAlgebraic('e7'),
      Square.fromAlgebraic('d8'),
      MoveType.Promotion,
      PieceType.Queen,
    );

    expect(notation.toSan(position, move)).toBe('exd8=Q');
  });

  it('does not disambiguate when only one piece can reach the destination', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('g1'),
      new Piece(Color.White, PieceType.Knight),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    position.board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.Black, PieceType.King),
    );

    const move = new Move(
      Square.fromAlgebraic('g1'),
      Square.fromAlgebraic('f3'),
    );

    expect(notation.toSan(position, move)).toBe('Nf3');
  });

  it('disambiguates two knights by file', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('b1'),
      new Piece(Color.White, PieceType.Knight),
    );

    position.board.setPiece(
      Square.fromAlgebraic('f1'),
      new Piece(Color.White, PieceType.Knight),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    // Black king
    position.board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const move = new Move(
      Square.fromAlgebraic('b1'),
      Square.fromAlgebraic('d2'),
    );

    expect(notation.toSan(position, move)).toBe('Nbd2');
  });

  it('disambiguates two rooks by rank', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.White, PieceType.King),
    );

    // Black king
    position.board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.King),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.Rook),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e2'),
      new Piece(Color.White, PieceType.Rook),
    );

    const move = new Move(
      Square.fromAlgebraic('e1'),
      Square.fromAlgebraic('e3'),
    );

    expect(notation.toSan(position, move)).toBe('R1e3');
  });

  it('does not disambiguate a pinned piece', () => {
    const position = new Position();

    // White king
    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    // Black king
    position.board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.King),
    );

    // White knights
    position.board.setPiece(
      Square.fromAlgebraic('c1'),
      new Piece(Color.White, PieceType.Knight),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e2'),
      new Piece(Color.White, PieceType.Knight),
    );

    // Black rook pins the knight on e2 to the king on e1.
    position.board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const move = new Move(
      Square.fromAlgebraic('c1'),
      Square.fromAlgebraic('d3'),
    );

    expect(notation.toSan(position, move)).toBe('Nd3');
  });

  it('adds check suffix when a move puts the opponent in check', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e2'),
      new Piece(Color.White, PieceType.Queen),
    );

    position.board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const move = new Move(
      Square.fromAlgebraic('e2'),
      Square.fromAlgebraic('e7'),
    );

    expect(notation.toSan(position, move)).toBe('Qe7+');
  });

  it('adds checkmate suffix when a move checkmates the opponent', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('f6'),
      new Piece(Color.White, PieceType.King),
    );

    position.board.setPiece(
      Square.fromAlgebraic('g6'),
      new Piece(Color.White, PieceType.Queen),
    );

    position.board.setPiece(
      Square.fromAlgebraic('h8'),
      new Piece(Color.Black, PieceType.King),
    );

    const move = new Move(
      Square.fromAlgebraic('g6'),
      Square.fromAlgebraic('g7'),
    );

    expect(notation.toSan(position, move)).toBe('Qg7#');
  });

  it('adds check suffix when the opponent can escape', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('f6'),
      new Piece(Color.White, PieceType.King),
    );

    position.board.setPiece(
      Square.fromAlgebraic('g6'),
      new Piece(Color.White, PieceType.Queen),
    );

    position.board.setPiece(
      Square.fromAlgebraic('h8'),
      new Piece(Color.Black, PieceType.King),
    );

    const move = new Move(
      Square.fromAlgebraic('g6'),
      Square.fromAlgebraic('h6'),
    );

    expect(notation.toSan(position, move)).toBe('Qh6+');
  });

  it('adds checkmate suffix when a capture checkmates the opponent', () => {
    const position = new Position();

    position.board.setPiece(
      Square.fromAlgebraic('f6'),
      new Piece(Color.White, PieceType.King),
    );

    position.board.setPiece(
      Square.fromAlgebraic('g6'),
      new Piece(Color.White, PieceType.Queen),
    );

    position.board.setPiece(
      Square.fromAlgebraic('h8'),
      new Piece(Color.Black, PieceType.King),
    );

    position.board.setPiece(
      Square.fromAlgebraic('g7'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const move = new Move(
      Square.fromAlgebraic('g6'),
      Square.fromAlgebraic('g7'),
      MoveType.Capture,
    );

    expect(notation.toSan(position, move)).toBe('Qxg7#');
  });
});
