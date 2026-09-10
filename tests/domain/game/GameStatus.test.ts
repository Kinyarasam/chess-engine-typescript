import { describe, expect, it } from 'vitest';
import { GameStatus } from '../../../src/domain/game/GameStatus';
import { GameStatusDetector } from '../../../src/domain/game/GameStatusDetector';
import { Board } from '../../../src/domain/board/Board';
import { Square } from '../../../src/domain/board/Square';
import { Piece } from '../../../src/domain/pieces/Piece';
import { Color } from '../../../src/domain/pieces/Color';
import { PieceType } from '../../../src/domain/pieces/PieceType';
import { Position } from '../../../src/domain/game/Position';

describe('GameStatus', () => {
  it('defines the possible game statuses', () => {
    expect(GameStatus.InProgress).toBe('in-progress');
    expect(GameStatus.Check).toBe('check');
    expect(GameStatus.Checkmate).toBe('checkmate');
    expect(GameStatus.Stalemate).toBe('stalemate');
    expect(GameStatus.DrawByFiftyMove).toBe('draw-by-fifty-move');
    expect(GameStatus.DrawByInsufficientMaterial).toBe(
      'draw-by-insufficient-material',
    );
    expect(GameStatus.DrawByThreefoldRepetition).toBe(
      'draw-by-threefold-repetition',
    );
  });

  it('detects an in-progress game', () => {
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
      Square.fromAlgebraic('e2'),
      new Piece(Color.White, PieceType.Pawn),
    );

    const position = new Position(board);
    const detector = new GameStatusDetector();

    expect(detector.getStatus(position)).toBe(GameStatus.InProgress);
  });

  it('detects check', () => {
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
      Square.fromAlgebraic('e2'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const position = new Position(board);
    const detector = new GameStatusDetector();

    expect(detector.getStatus(position)).toBe(GameStatus.Check);
  });

  it('detects checkmate', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('h8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('f6'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('g7'),
      new Piece(Color.White, PieceType.Queen),
    );

    const position = new Position(board, Color.Black);

    const detector = new GameStatusDetector();

    expect(detector.getStatus(position)).toBe(GameStatus.Checkmate);
  });

  it('detects stalemate', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('h8'),
      new Piece(Color.Black, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('f7'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('g6'),
      new Piece(Color.White, PieceType.Queen),
    );

    const position = new Position(board, Color.Black);

    const detector = new GameStatusDetector();

    expect(detector.getStatus(position)).toBe(GameStatus.Stalemate);
  });

  it('detects a draw by the fifty-move rule', () => {
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
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    const position = new Position(board);

    position.halfmoveClock = 100;

    const detector = new GameStatusDetector();

    expect(detector.getStatus(position)).toBe(GameStatus.DrawByFiftyMove);
  });

  it('does not declare a fifty-move draw before 100 halfmoves', () => {
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
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    const position = new Position(board);

    position.halfmoveClock = 99;

    const detector = new GameStatusDetector();

    expect(detector.getStatus(position)).toBe(GameStatus.InProgress);
  });

  it('declare a fifty-move draw after more than 100 halfmoves', () => {
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
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    const position = new Position(board);

    position.halfmoveClock = 101;

    const detector = new GameStatusDetector();

    expect(detector.getStatus(position)).toBe(GameStatus.DrawByFiftyMove);
  });

  it('detects a draw by insufficient material', () => {
    const board = new Board();

    board.setPiece(
      Square.fromAlgebraic('e1'),
      new Piece(Color.White, PieceType.King),
    );

    board.setPiece(
      Square.fromAlgebraic('e8'),
      new Piece(Color.Black, PieceType.King),
    );

    const position = new Position(board);

    const detector = new GameStatusDetector();

    expect(detector.getStatus(position)).toBe(
      GameStatus.DrawByInsufficientMaterial,
    );
  });

  it('detects a draw by threefold repetition', () => {
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
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    const position = new Position(board);
    const detector = new GameStatusDetector();

    expect(detector.getStatus(position, 3)).toBe(
      GameStatus.DrawByThreefoldRepetition,
    );
  });

  it('does not detect threefold repetition before the third occurrence', () => {
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
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    const position = new Position(board);
    const detector = new GameStatusDetector();

    expect(detector.getStatus(position, 2)).not.toBe(
      GameStatus.DrawByThreefoldRepetition,
    );
  });
});
