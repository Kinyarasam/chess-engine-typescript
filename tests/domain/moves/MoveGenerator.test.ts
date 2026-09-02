import { describe, expect, it } from 'vitest';

import { Board } from '../../../src/domain/board/Board.js';
import { Square } from '../../../src/domain/board/Square.js';
import { Color } from '../../../src/domain/pieces/Color.js';
import { Piece } from '../../../src/domain/pieces/Piece.js';
import { PieceType } from '../../../src/domain/pieces/PieceType.js';
import { MoveGenerator } from '../../../src/domain/moves/MoveGenerator.js';
import { MoveType } from '../../../src/domain/moves/MoveType.js';
import { Position } from '../../../src/domain/game/Position.js';
import { CastlingRights } from '../../../src/domain/game/CastlingRights.js';
import { Move } from '../../../src/domain/moves/Move.js';

describe('MoveGenerator', () => {
  const generator = new MoveGenerator();

  it('generates one forward move for a white pawn', () => {
    const position = new Position();
    const { board } = position;
    const e2 = Square.fromAlgebraic('e2');

    board.setPiece(e2, new Piece(Color.White, PieceType.Pawn));

    const moves = generator.generatePawnMoves(position, e2);

    expect(moves).toHaveLength(2);
    expect(moves.some((move) => move.to.toAlgebraic() === 'e3')).toBe(true);
    expect(moves.some((move) => move.to.toAlgebraic() === 'e4')).toBe(true);
  });

  it('generates one and two square moves for a black pawn', () => {
    const position = new Position();
    const { board } = position;
    const e7 = Square.fromAlgebraic('e7');

    board.setPiece(e7, new Piece(Color.Black, PieceType.Pawn));

    const moves = generator.generatePawnMoves(position, e7);

    expect(moves).toHaveLength(2);
    expect(moves.some((move) => move.to.toAlgebraic() === 'e6')).toBe(true);
    expect(moves.some((move) => move.to.toAlgebraic() === 'e5')).toBe(true);
  });

  it('does not generate a double move after leaving the starting rank', () => {
    const position = new Position();

    const e4 = Square.fromAlgebraic('e4');

    position.board.setPiece(e4, new Piece(Color.White, PieceType.Pawn));

    const moves = generator.generatePawnMoves(position, e4);

    expect(moves).toHaveLength(1);
    expect(moves[0]?.to.toAlgebraic()).toBe('e5');
  });

  it('does not move forward into an occupied square', () => {
    const position = new Position();

    const { board } = position;

    const e2 = Square.fromAlgebraic('e2');
    const e3 = Square.fromAlgebraic('e3');

    board.setPiece(e2, new Piece(Color.White, PieceType.Pawn));

    board.setPiece(e3, new Piece(Color.Black, PieceType.Knight));

    const moves = generator.generatePawnMoves(position, e2);

    expect(moves).toHaveLength(0);
  });

  it('does not generate a double move when the square immediately ahead is occupied', () => {
    const position = new Position();

    const e2 = Square.fromAlgebraic('e2');
    const e3 = Square.fromAlgebraic('e3');

    position.board.setPiece(e2, new Piece(Color.White, PieceType.Pawn));

    position.board.setPiece(e3, new Piece(Color.White, PieceType.Knight));

    const moves = generator.generatePawnMoves(position, e2);

    expect(moves).toHaveLength(0);
  });

  it('does not generate a double move when the destination is occupied', () => {
    const position = new Position();

    const e2 = Square.fromAlgebraic('e2');
    const e4 = Square.fromAlgebraic('e4');

    position.board.setPiece(e2, new Piece(Color.White, PieceType.Pawn));

    position.board.setPiece(e4, new Piece(Color.Black, PieceType.Knight));

    const moves = generator.generatePawnMoves(position, e2);

    expect(moves).toHaveLength(1);
    expect(moves[0]?.to.toAlgebraic()).toBe('e3');
  });

  it('generates a capture to the left', () => {
    const position = new Position();

    const { board } = position;

    const e4 = Square.fromAlgebraic('e4');
    const d5 = Square.fromAlgebraic('d5');

    board.setPiece(e4, new Piece(Color.White, PieceType.Pawn));

    board.setPiece(d5, new Piece(Color.Black, PieceType.Knight));

    const moves = generator.generatePawnMoves(position, e4);

    expect(
      moves.some(
        (move) =>
          move.to.toAlgebraic() === 'd5' && move.type === MoveType.Capture,
      ),
    ).toBe(true);
  });

  it('generates a capture to the right', () => {
    const position = new Position();

    const { board } = position;

    const e4 = Square.fromAlgebraic('e4');
    const f5 = Square.fromAlgebraic('f5');

    board.setPiece(e4, new Piece(Color.White, PieceType.Pawn));

    board.setPiece(f5, new Piece(Color.Black, PieceType.Knight));

    const moves = generator.generatePawnMoves(position, e4);

    expect(
      moves.some(
        (move) =>
          move.to.toAlgebraic() === 'f5' && move.type === MoveType.Capture,
      ),
    ).toBe(true);
  });

  it('does not capture a friendly piece', () => {
    const position = new Position();

    const { board } = position;

    const e4 = Square.fromAlgebraic('e4');
    const d5 = Square.fromAlgebraic('d5');

    board.setPiece(e4, new Piece(Color.White, PieceType.Pawn));

    board.setPiece(d5, new Piece(Color.White, PieceType.Knight));

    const moves = generator.generatePawnMoves(position, e4);

    expect(moves.some((move) => move.to.toAlgebraic() === 'd5')).toBe(false);
  });

  it('returns no moves for a non-pawn piece', () => {
    const position = new Position();

    const { board } = position;

    const e4 = Square.fromAlgebraic('e4');

    board.setPiece(e4, new Piece(Color.White, PieceType.Knight));

    expect(generator.generatePawnMoves(position, e4)).toHaveLength(0);
  });

  it('returns no moves for an empty square', () => {
    const position = new Position();

    const e4 = Square.fromAlgebraic('e4');

    expect(generator.generatePawnMoves(position, e4)).toHaveLength(0);
  });

  it('generates all eight knight moves from the center', () => {
    const board = new Board();
    const e4 = Square.fromAlgebraic('e4');

    board.setPiece(e4, new Piece(Color.White, PieceType.Knight));

    const moves = generator.generateKnightMoves(board, e4);

    const destinations = moves.map((move) => move.to.toAlgebraic());

    expect(moves).toHaveLength(8);

    expect(destinations).toEqual(
      expect.arrayContaining(['c3', 'c5', 'd2', 'd6', 'f2', 'f6', 'g3', 'g5']),
    );
  });

  it('generates only valid knight moves from a corner', () => {
    const position = new Position();

    const a1 = Square.fromAlgebraic('a1');

    position.board.setPiece(a1, new Piece(Color.White, PieceType.Knight));

    const moves = generator.generateKnightMoves(position.board, a1);

    const destinations = moves.map((move) => move.to.toAlgebraic());

    expect(moves).toHaveLength(2);

    expect(destinations).toEqual(expect.arrayContaining(['b3', 'c2']));
  });

  it('knight can jump over occupied squares', () => {
    const board = new Board();

    const e4 = Square.fromAlgebraic('e4');

    board.setPiece(e4, new Piece(Color.White, PieceType.Knight));

    board.setPiece(
      Square.fromAlgebraic('e5'),
      new Piece(Color.White, PieceType.Pawn),
    );

    board.setPiece(
      Square.fromAlgebraic('f4'),
      new Piece(Color.White, PieceType.Pawn),
    );

    const moves = generator.generateKnightMoves(board, e4);

    expect(moves).toHaveLength(8);
  });

  it('knight captures an enemy piece', () => {
    const board = new Board();

    const e4 = Square.fromAlgebraic('e4');
    const f6 = Square.fromAlgebraic('f6');

    board.setPiece(e4, new Piece(Color.White, PieceType.Knight));

    board.setPiece(f6, new Piece(Color.Black, PieceType.Pawn));

    const moves = generator.generateKnightMoves(board, e4);

    const capture = moves.find((move) => move.to.toAlgebraic() === 'f6');

    expect(capture).toBeDefined();
    expect(capture?.type).toBe(MoveType.Capture);
  });

  it('knight cannot capture a friendly piece', () => {
    const board = new Board();

    const e4 = Square.fromAlgebraic('e4');
    const f6 = Square.fromAlgebraic('f6');

    board.setPiece(e4, new Piece(Color.White, PieceType.Knight));

    board.setPiece(f6, new Piece(Color.White, PieceType.Pawn));

    const moves = generator.generateKnightMoves(board, e4);

    expect(moves.some((move) => move.to.toAlgebraic() === 'f6')).toBe(false);
  });

  it('returns no knight moves for a non-knight piece', () => {
    const board = new Board();
    const e4 = Square.fromAlgebraic('e4');

    board.setPiece(e4, new Piece(Color.White, PieceType.Bishop));

    expect(generator.generateKnightMoves(board, e4)).toHaveLength(0);
  });

  it('generates bishop moves in all four diagonal directions', () => {
    const board = new Board();
    const e4 = Square.fromAlgebraic('e4');

    board.setPiece(e4, new Piece(Color.White, PieceType.Bishop));

    const moves = generator.generateBishopMoves(board, e4);

    const destinations = moves.map((move) => move.to.toAlgebraic());

    expect(moves).toHaveLength(13);

    expect(destinations).toEqual(
      expect.arrayContaining([
        'f5',
        'g6',
        'h7',
        'd5',
        'c6',
        'b7',
        'a8',
        'f3',
        'g2',
        'h1',
        'd3',
        'c2',
        'b1',
      ]),
    );
  });

  it('generates rook moves in all four straight directions', () => {
    const board = new Board();
    const e4 = Square.fromAlgebraic('e4');

    board.setPiece(e4, new Piece(Color.White, PieceType.Rook));

    const moves = generator.generateRookMoves(board, e4);

    expect(moves).toHaveLength(14);

    const destinations = moves.map((move) => move.to.toAlgebraic());

    expect(destinations).toEqual(
      expect.arrayContaining([
        'e1',
        'e2',
        'e3',
        'e5',
        'e6',
        'e7',
        'e8',
        'a4',
        'b4',
        'c4',
        'd4',
        'f4',
        'g4',
        'h4',
      ]),
    );
  });

  it('rook stops before a friendly piece', () => {
    const board = new Board();

    const e4 = Square.fromAlgebraic('e4');
    const e6 = Square.fromAlgebraic('e6');

    board.setPiece(e4, new Piece(Color.White, PieceType.Rook));

    board.setPiece(e6, new Piece(Color.White, PieceType.Pawn));

    const moves = generator.generateRookMoves(board, e4);

    expect(moves.some((move) => move.to.toAlgebraic() === 'e5')).toBe(true);

    expect(moves.some((move) => move.to.toAlgebraic() === 'e6')).toBe(false);

    expect(moves.some((move) => move.to.toAlgebraic() === 'e7')).toBe(false);
  });

  it('rook captures an enemy piece and stops beyond it', () => {
    const board = new Board();

    const e4 = Square.fromAlgebraic('e4');
    const e6 = Square.fromAlgebraic('e6');
    const e7 = Square.fromAlgebraic('e7');

    board.setPiece(e4, new Piece(Color.White, PieceType.Rook));

    board.setPiece(e6, new Piece(Color.Black, PieceType.Pawn));

    board.setPiece(e7, new Piece(Color.Black, PieceType.Queen));

    const moves = generator.generateRookMoves(board, e4);

    expect(
      moves.some(
        (move) =>
          move.to.toAlgebraic() == 'e6' && move.type === MoveType.Capture,
      ),
    ).toBe(true);

    expect(moves.some((move) => move.to.toAlgebraic() === 'e7')).toBe(false);
  });

  it('generates the correct rook moves from a corner', () => {
    const board = new Board();
    const a1 = Square.fromAlgebraic('a1');

    board.setPiece(a1, new Piece(Color.White, PieceType.Rook));

    const moves = generator.generateRookMoves(board, a1);

    expect(moves).toHaveLength(14);

    const destinations = moves.map((move) => move.to.toAlgebraic());

    expect(destinations).toEqual(
      expect.arrayContaining([
        'a2',
        'a3',
        'a4',
        'a5',
        'a6',
        'a7',
        'a8',
        'b1',
        'c1',
        'd1',
        'e1',
        'f1',
        'g1',
        'h1',
      ]),
    );
  });

  it('generates queen moves in all eight directions', () => {
    const board = new Board();
    const e4 = Square.fromAlgebraic('e4');

    board.setPiece(e4, new Piece(Color.White, PieceType.Queen));

    const moves = generator.generateQueenMoves(board, e4);

    expect(moves).toHaveLength(27);

    const destinations = moves.map((move) => move.to.toAlgebraic());

    expect(destinations).toEqual(
      expect.arrayContaining([
        // Diagonal
        'f5',
        'g6',
        'h7',
        'f3',
        'g2',
        'h1',
        'd3',
        'c2',
        'b1',
        'd5',
        'c6',
        'b7',
        'a8',

        // Straight
        'e1',
        'e2',
        'e3',
        'e5',
        'e6',
        'e7',
        'e8',
        'a4',
        'b4',
        'c4',
        'd4',
        'f4',
        'g4',
        'h4',
      ]),
    );
  });

  it('queen stops sliding at a friendly piece', () => {
    const board = new Board();

    const e4 = Square.fromAlgebraic('e4');
    const e6 = Square.fromAlgebraic('e6');
    const g6 = Square.fromAlgebraic('g6');

    board.setPiece(e4, new Piece(Color.White, PieceType.Queen));

    board.setPiece(e6, new Piece(Color.White, PieceType.Pawn));

    board.setPiece(g6, new Piece(Color.White, PieceType.Pawn));

    const moves = generator.generateQueenMoves(board, e4);

    expect(moves.some((move) => move.to.toAlgebraic() === 'e5')).toBe(true);

    expect(moves.some((move) => move.to.toAlgebraic() === 'e6')).toBe(false);

    expect(moves.some((move) => move.to.toAlgebraic() === 'e7')).toBe(false);

    expect(moves.some((move) => move.to.toAlgebraic() === 'f5')).toBe(true);

    expect(moves.some((move) => move.to.toAlgebraic() === 'g6')).toBe(false);

    expect(moves.some((move) => move.to.toAlgebraic() === 'h7')).toBe(false);
  });

  it('queen captures an enemy piece and stops beyond it', () => {
    const board = new Board();

    const e4 = Square.fromAlgebraic('e4');
    const h4 = Square.fromAlgebraic('h4');

    board.setPiece(e4, new Piece(Color.White, PieceType.Queen));

    board.setPiece(h4, new Piece(Color.Black, PieceType.Rook));

    const moves = generator.generateQueenMoves(board, e4);

    const capture = moves.find((move) => move.to.toAlgebraic() === 'h4');

    expect(capture).toBeDefined();
    expect(capture?.type).toBe(MoveType.Capture);
  });

  it('returns no queen moves for a non-queen piece', () => {
    const board = new Board();
    const e4 = Square.fromAlgebraic('e4');

    board.setPiece(e4, new Piece(Color.White, PieceType.Rook));

    expect(generator.generateQueenMoves(board, e4)).toHaveLength(0);
  });

  it('generates all eight king moves from the center', () => {
    const board = new Board();
    const e4 = Square.fromAlgebraic('e4');

    board.setPiece(e4, new Piece(Color.White, PieceType.King));

    const moves = generator.generateKingMoves(board, e4);

    expect(moves).toHaveLength(8);

    const destinations = moves.map((move) => move.to.toAlgebraic());

    expect(destinations).toEqual(
      expect.arrayContaining(['d3', 'e3', 'f3', 'd4', 'f4', 'd5', 'e5', 'f5']),
    );
  });

  it('generates only valid king moves from a corner', () => {
    const board = new Board();
    const a1 = Square.fromAlgebraic('a1');

    board.setPiece(a1, new Piece(Color.White, PieceType.King));

    const moves = generator.generateKingMoves(board, a1);

    expect(moves).toHaveLength(3);

    const destinations = moves.map((move) => move.to.toAlgebraic());

    expect(destinations).toEqual(expect.arrayContaining(['a2', 'b1', 'b2']));
  });

  it('does not capture friendly pieces', () => {
    const board = new Board();

    const e4 = Square.fromAlgebraic('e4');
    const e5 = Square.fromAlgebraic('e5');

    board.setPiece(e4, new Piece(Color.White, PieceType.King));

    board.setPiece(e5, new Piece(Color.White, PieceType.Pawn));

    const moves = generator.generateKingMoves(board, e4);

    expect(moves.some((move) => move.to.toAlgebraic() === 'e5')).toBe(false);
  });

  it('captures an enemy piece', () => {
    const board = new Board();

    const e4 = Square.fromAlgebraic('e4');
    const f5 = Square.fromAlgebraic('f5');

    board.setPiece(e4, new Piece(Color.White, PieceType.King));

    board.setPiece(f5, new Piece(Color.Black, PieceType.Pawn));

    const moves = generator.generateKingMoves(board, e4);

    const capture = moves.find((move) => move.to.toAlgebraic() === 'f5');

    expect(capture).toBeDefined();
    expect(capture?.type).toBe(MoveType.Capture);
  });

  it('returns no king moves for a non-king piece', () => {
    const board = new Board();
    const e4 = Square.fromAlgebraic('e4');

    board.setPiece(e4, new Piece(Color.White, PieceType.Queen));

    expect(generator.generateKingMoves(board, e4)).toHaveLength(0);
  });

  it('returns no moves for an empty square', () => {
    const position = new Position();

    const e4 = Square.fromAlgebraic('e4');

    expect(generator.generatePieceMoves(position, e4)).toHaveLength(0);
  });

  it('dispatches to pawn move generation', () => {
    const position = new Position();

    const { board } = position;
    const e2 = Square.fromAlgebraic('e2');

    board.setPiece(e2, new Piece(Color.White, PieceType.Pawn));

    const moves = generator.generatePieceMoves(position, e2);

    expect(moves).toHaveLength(2);

    expect(moves.some((move) => move.to.toAlgebraic() === 'e3')).toBe(true);

    expect(moves.some((move) => move.to.toAlgebraic() === 'e4')).toBe(true);
  });

  it('dispatches to knight move generation', () => {
    const position = new Position();

    const e4 = Square.fromAlgebraic('e4');

    position.board.setPiece(e4, new Piece(Color.White, PieceType.Knight));

    const moves = generator.generatePieceMoves(position, e4);

    expect(moves).toHaveLength(8);
  });

  it('dispatches to bishop move generation', () => {
    const position = new Position();

    const e4 = Square.fromAlgebraic('e4');

    position.board.setPiece(e4, new Piece(Color.White, PieceType.Bishop));

    expect(generator.generatePieceMoves(position, e4)).toHaveLength(13);
  });

  it('dispatches to rook move generation', () => {
    const position = new Position();

    const e4 = Square.fromAlgebraic('e4');

    position.board.setPiece(e4, new Piece(Color.White, PieceType.Rook));

    expect(generator.generatePieceMoves(position, e4)).toHaveLength(14);
  });

  it('dispatches to queen move generation', () => {
    const position = new Position();
    const { board } = position;
    const e4 = Square.fromAlgebraic('e4');

    board.setPiece(e4, new Piece(Color.White, PieceType.Queen));

    expect(generator.generatePieceMoves(position, e4)).toHaveLength(27);
  });

  it('dispatches to king move generation', () => {
    const position = new Position();

    const e4 = Square.fromAlgebraic('e4');

    position.board.setPiece(e4, new Piece(Color.White, PieceType.King));

    expect(generator.generatePieceMoves(position, e4)).toHaveLength(8);
  });

  it('generates moves only for the side to move', () => {
    const position = new Position();

    const e2 = Square.fromAlgebraic('e2');
    const e7 = Square.fromAlgebraic('e7');

    position.board.setPiece(e2, new Piece(Color.White, PieceType.Pawn));

    position.board.setPiece(e7, new Piece(Color.Black, PieceType.Pawn));

    const moves = generator.generateMoves(position);

    expect(moves).toHaveLength(2);

    expect(moves.every((move) => move.from.toAlgebraic() === 'e2')).toBe(true);
  });

  it('generates black moves when black is to move', () => {
    const board = new Board();

    const e2 = Square.fromAlgebraic('e2');
    const e7 = Square.fromAlgebraic('e7');

    board.setPiece(e2, new Piece(Color.White, PieceType.Pawn));

    board.setPiece(e7, new Piece(Color.Black, PieceType.Pawn));

    const position = new Position(board, Color.Black);

    const moves = generator.generateMoves(position);

    expect(moves).toHaveLength(2);

    expect(moves.every((move) => move.from.toAlgebraic() === 'e7')).toBe(true);
  });

  it('returns no moves for an empty position', () => {
    const position = new Position();

    expect(generator.generateMoves(position)).toHaveLength(0);
  });

  it('generates moves for all friendly pieces', () => {
    const board = new Board();

    const e2 = Square.fromAlgebraic('e2');
    const b1 = Square.fromAlgebraic('b1');

    board.setPiece(e2, new Piece(Color.White, PieceType.Pawn));

    board.setPiece(b1, new Piece(Color.White, PieceType.Knight));

    const position = new Position(board, Color.White);

    const moves = generator.generateMoves(position);

    expect(moves).toHaveLength(5);
  });

  it('generates piece moves independently of side to move', () => {
    const position = new Position();

    const e2 = Square.fromAlgebraic('e2');

    position.board.setPiece(e2, new Piece(Color.White, PieceType.Pawn));

    const moves = generator.generatePieceMoves(position, e2);

    expect(moves).toHaveLength(2);
  });

  it('generates all promotion options for a white pawn', () => {
    const position = new Position();

    const e7 = Square.fromAlgebraic('e7');

    position.board.setPiece(e7, new Piece(Color.White, PieceType.Pawn));

    const moves = generator.generatePawnMoves(position, e7);

    expect(moves).toHaveLength(4);

    expect(
      moves.every(
        (move) =>
          move.to.toAlgebraic() === 'e8' && move.type === MoveType.Promotion,
      ),
    ).toBe(true);

    expect(moves.map((move) => move.promotion)).toEqual([
      PieceType.Queen,
      PieceType.Rook,
      PieceType.Bishop,
      PieceType.Knight,
    ]);
  });

  it('generates all promotion options for a black pawn', () => {
    const position = new Position();

    const e2 = Square.fromAlgebraic('e2');

    position.board.setPiece(e2, new Piece(Color.Black, PieceType.Pawn));

    const moves = generator.generatePawnMoves(position, e2);

    expect(moves).toHaveLength(4);

    expect(
      moves.every(
        (move) =>
          move.to.toAlgebraic() === 'e1' && move.type === MoveType.Promotion,
      ),
    ).toBe(true);
  });

  it('generates promotion options when capturing', () => {
    const position = new Position();

    const e7 = Square.fromAlgebraic('e7');
    const f8 = Square.fromAlgebraic('f8');

    position.board.setPiece(e7, new Piece(Color.White, PieceType.Pawn));

    position.board.setPiece(f8, new Piece(Color.Black, PieceType.Rook));

    const moves = generator.generatePawnMoves(position, e7);

    const captures = moves.filter((move) => move.to.toAlgebraic() === 'f8');

    expect(captures).toHaveLength(4);

    expect(captures.every((move) => move.type === MoveType.Promotion)).toBe(
      true,
    );
  });

  it('does not generate promotion when the final square is occupied', () => {
    const position = new Position();

    const e7 = Square.fromAlgebraic('e7');
    const e8 = Square.fromAlgebraic('e8');

    position.board.setPiece(e7, new Piece(Color.White, PieceType.Pawn));

    position.board.setPiece(e8, new Piece(Color.White, PieceType.Rook));

    const moves = generator.generatePawnMoves(position, e7);

    expect(moves).toHaveLength(0);
  });

  it('generates a white enpassant capture to the left', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('f5'),
      new Piece(Color.White, PieceType.Pawn),
    );

    board.setPiece(
      Square.fromAlgebraic('e5'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.None,
      Square.fromAlgebraic('e6'),
    );

    const generator = new MoveGenerator();

    const moves = generator.generateMoves(position);

    expect(moves).toContainEqual(
      new Move(
        Square.fromAlgebraic('f5'),
        Square.fromAlgebraic('e6'),
        MoveType.EnPassant,
      ),
    );
  });

  it('generates a black enpassant capture to the right', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e4'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    board.setPiece(
      Square.fromAlgebraic('f4'),
      new Piece(Color.White, PieceType.Pawn),
    );

    const position = new Position(
      board,
      Color.Black,
      CastlingRights.None,
      Square.fromAlgebraic('f3'),
    );

    const generator = new MoveGenerator();

    const moves = generator.generateMoves(position);

    expect(moves).toContainEqual(
      new Move(
        Square.fromAlgebraic('e4'),
        Square.fromAlgebraic('f3'),
        MoveType.EnPassant,
      ),
    );
  });

  it('does not generate en passant when no en passant square is available', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('f5'),
      new Piece(Color.White, PieceType.Pawn),
    );

    board.setPiece(
      Square.fromAlgebraic('e5'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.None,
      null,
    );

    const generator = new MoveGenerator();

    const moves = generator.generateMoves(position);

    expect(moves).not.toContainEqual(
      new Move(
        Square.fromAlgebraic('f5'),
        Square.fromAlgebraic('e6'),
        MoveType.EnPassant,
      ),
    );
  });

  it('does not generate en passant when the target square is occupied', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('f5'),
      new Piece(Color.White, PieceType.Pawn),
    );

    board.setPiece(
      Square.fromAlgebraic('e5'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    board.setPiece(
      Square.fromAlgebraic('e6'),
      new Piece(Color.White, PieceType.Knight),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.None,
      Square.fromAlgebraic('e6'),
    );

    const generator = new MoveGenerator();

    const moves = generator.generateMoves(position);

    expect(moves).not.toContainEqual(
      new Move(
        Square.fromAlgebraic('f5'),
        Square.fromAlgebraic('e6'),
        MoveType.EnPassant,
      ),
    );
  });

  it('does not generate en passant when the adjacent piece is not an enemy pawn', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('f5'),
      new Piece(Color.White, PieceType.Pawn),
    );

    board.setPiece(
      Square.fromAlgebraic('e5'),
      new Piece(Color.Black, PieceType.Knight),
    );

    const position = new Position(
      board,
      Color.White,
      CastlingRights.None,
      Square.fromAlgebraic('e6'),
    );

    const generator = new MoveGenerator();

    const moves = generator.generateMoves(position);

    expect(moves).not.toContainEqual(
      new Move(
        Square.fromAlgebraic('f5'),
        Square.fromAlgebraic('e6'),
        MoveType.EnPassant,
      ),
    );
  });
});
