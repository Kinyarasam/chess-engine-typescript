import { describe, expect, it } from 'vitest';
import { Position } from '../../../src/domain/game/Position';
import { Board } from '../../../src/domain/board/Board';
import { Square } from '../../../src/domain/board/Square';
import { Piece } from '../../../src/domain/pieces/Piece';
import { Color } from '../../../src/domain/pieces/Color';
import { PieceType } from '../../../src/domain/pieces/PieceType';
import { Move } from '../../../src/domain/moves/Move';
import { Game } from '../../../src/domain/game/Game';
import { CastlingRights } from '../../../src/domain/game/CastlingRights';
import { MoveType } from '../../../src/domain/moves/MoveType';
import { GameStatus } from '../../../src/domain/game/GameStatus';

function createBasicPosition(): Position {
  const board = new Board();

  const e1 = Square.fromAlgebraic('e1');
  const e2 = Square.fromAlgebraic('e2');
  const e8 = Square.fromAlgebraic('e8');

  board.setPiece(e1, new Piece(Color.White, PieceType.King));

  board.setPiece(e2, new Piece(Color.White, PieceType.Pawn));

  board.setPiece(e8, new Piece(Color.Black, PieceType.King));

  const position = new Position(board);
  return position;
}

function createGame(): Game {
  const board = new Board();

  board.setPiece(
    Square.fromAlgebraic('e1'),
    new Piece(Color.White, PieceType.King),
  );

  board.setPiece(
    Square.fromAlgebraic('g1'),
    new Piece(Color.White, PieceType.Knight),
  );

  board.setPiece(
    Square.fromAlgebraic('e8'),
    new Piece(Color.Black, PieceType.King),
  );

  board.setPiece(
    Square.fromAlgebraic('g8'),
    new Piece(Color.Black, PieceType.Knight),
  );

  return new Game(new Position(board));
}

function move(from: string, to: string): Move {
  return new Move(Square.fromAlgebraic(from), Square.fromAlgebraic(to));
}

function createCheckmateGame(): Game {
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

  return new Game(new Position(board, Color.Black));
}

function createStalemateGame(): Game {
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

  return new Game(new Position(board, Color.Black));
}

describe('Game', () => {
  it('creates a game with a position', () => {
    const position = new Position();
    const game = new Game(position);

    expect(game.getPosition()).toBe(position);
  });

  it('plays a legal move', () => {
    const position = createBasicPosition();
    const game = new Game(position);

    const move = new Move(
      Square.fromAlgebraic('e2'),
      Square.fromAlgebraic('e4'),
    );

    game.play(move);

    expect(position.board.getPiece(Square.fromAlgebraic('e2'))).toBeNull();

    expect(position.board.getPiece(Square.fromAlgebraic('e4'))).toEqual(
      new Piece(Color.White, PieceType.Pawn),
    );
  });

  it('rejects an illegal move', () => {
    const position = createBasicPosition();
    const game = new Game(position);

    const move = new Move(
      Square.fromAlgebraic('e2'),
      Square.fromAlgebraic('e5'),
    );

    expect(() => game.play(move)).toThrow();
  });

  it('records played moves in history', () => {
    const position = createBasicPosition();
    const game = new Game(position);

    const move = new Move(
      Square.fromAlgebraic('e2'),
      Square.fromAlgebraic('e4'),
    );

    game.play(move);

    expect(game.getHistory()).toEqual([move]);
  });

  it('changes the side to move after a legal move', () => {
    const position = createBasicPosition();
    const game = new Game(position);

    game.play(new Move(Square.fromAlgebraic('e2'), Square.fromAlgebraic('e4')));

    expect(position.sideToMove).toBe(Color.Black);
  });

  it('sets the en passant square after a black double pawn push', () => {
    const position = createBasicPosition();

    position.sideToMove = Color.Black;

    position.board.setPiece(
      Square.fromAlgebraic('e7'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    const game = new Game(position);

    game.play(new Move(Square.fromAlgebraic('e7'), Square.fromAlgebraic('e5')));

    expect(position.enPassantSquare?.toAlgebraic()).toBe('e6');
  });

  it('clears the en passant square after a non-double-pawn move', () => {
    const position = createBasicPosition();

    position.enPassantSquare = Square.fromAlgebraic('e3');

    position.board.setPiece(
      Square.fromAlgebraic('g8'),
      new Piece(Color.Black, PieceType.Knight),
    );

    position.sideToMove = Color.Black;

    const game = new Game(position);

    game.play(new Move(Square.fromAlgebraic('g8'), Square.fromAlgebraic('f6')));

    expect(position.enPassantSquare).toBeNull();
  });

  it('resets the halfmove clock after a pawn move', () => {
    const position = createBasicPosition();
    position.halfmoveClock = 17;

    const game = new Game(position);

    game.play(new Move(Square.fromAlgebraic('e2'), Square.fromAlgebraic('e4')));

    expect(position.halfmoveClock).toBe(0);
  });

  it('increments the fullmove number after Black moves', () => {
    const position = createBasicPosition();

    position.sideToMove = Color.Black;

    position.board.setPiece(
      Square.fromAlgebraic('e7'),
      new Piece(Color.Black, PieceType.Pawn),
    );

    const game = new Game(position);

    game.play(new Move(Square.fromAlgebraic('e7'), Square.fromAlgebraic('e6')));

    expect(position.fullmoveNumber).toBe(2);
  });

  it('removes both White castling rights when the White king moves', () => {
    const position = createBasicPosition();

    position.castlingRights =
      CastlingRights.WhiteKingSide | CastlingRights.WhiteQueenSide;

    const game = new Game(position);

    game.play(new Move(Square.fromAlgebraic('e1'), Square.fromAlgebraic('f1')));

    expect(position.castlingRights).toBe(CastlingRights.None);
  });

  it('removes White queenside castling rights when the a1 rook moves', () => {
    const position = createBasicPosition();

    position.castlingRights =
      CastlingRights.WhiteKingSide | CastlingRights.WhiteQueenSide;

    position.board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    const game = new Game(position);

    game.play(new Move(Square.fromAlgebraic('a1'), Square.fromAlgebraic('a2')));

    expect(position.castlingRights).toBe(CastlingRights.WhiteKingSide);
  });

  it('removes White kingside castling rights when the h1 rook moves', () => {
    const position = createBasicPosition();

    position.castlingRights =
      CastlingRights.WhiteKingSide | CastlingRights.WhiteQueenSide;

    position.board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.White, PieceType.Rook),
    );

    const game = new Game(position);

    game.play(new Move(Square.fromAlgebraic('h1'), Square.fromAlgebraic('g1')));

    expect(position.castlingRights).toBe(CastlingRights.WhiteQueenSide);
  });

  it('removes Black queenside castling rights when the a8 rook moves', () => {
    const position = createBasicPosition();

    position.sideToMove = Color.Black;

    position.castlingRights =
      CastlingRights.BlackKingSide | CastlingRights.BlackQueenSide;

    position.board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const game = new Game(position);

    game.play(new Move(Square.fromAlgebraic('a8'), Square.fromAlgebraic('a7')));

    expect(position.castlingRights).toBe(CastlingRights.BlackKingSide);
  });

  it('removes Black kingside castling rights when the h8 rook moves', () => {
    const position = createBasicPosition();

    position.sideToMove = Color.Black;

    position.castlingRights =
      CastlingRights.BlackKingSide | CastlingRights.BlackQueenSide;

    position.board.setPiece(
      Square.fromAlgebraic('h8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    const game = new Game(position);

    game.play(new Move(Square.fromAlgebraic('h8'), Square.fromAlgebraic('g8')));

    expect(position.castlingRights).toBe(CastlingRights.BlackQueenSide);
  });

  it('removes White queenside castling rights when the a1 rook is captured', () => {
    const position = createBasicPosition();

    position.sideToMove = Color.Black;

    position.castlingRights =
      CastlingRights.WhiteKingSide | CastlingRights.WhiteQueenSide;

    position.board.setPiece(
      Square.fromAlgebraic('a1'),
      new Piece(Color.White, PieceType.Rook),
    );

    position.board.setPiece(
      Square.fromAlgebraic('b2'),
      new Piece(Color.Black, PieceType.Bishop),
    );

    const game = new Game(position);

    game.play(
      new Move(
        Square.fromAlgebraic('b2'),
        Square.fromAlgebraic('a1'),
        MoveType.Capture,
      ),
    );

    expect(position.castlingRights).toBe(CastlingRights.WhiteKingSide);
  });

  it('removes White kingside castling rights when the h1 rook is captured', () => {
    const position = createBasicPosition();

    position.sideToMove = Color.Black;

    position.castlingRights =
      CastlingRights.WhiteKingSide | CastlingRights.WhiteQueenSide;

    position.board.setPiece(
      Square.fromAlgebraic('h1'),
      new Piece(Color.White, PieceType.Rook),
    );

    position.board.setPiece(
      Square.fromAlgebraic('g2'),
      new Piece(Color.Black, PieceType.Bishop),
    );

    const game = new Game(position);

    game.play(
      new Move(
        Square.fromAlgebraic('g2'),
        Square.fromAlgebraic('h1'),
        MoveType.Capture,
      ),
    );

    expect(position.castlingRights).toBe(CastlingRights.WhiteQueenSide);
  });

  it('removes Black queenside castling rights when the a8 rook is captured', () => {
    const position = createBasicPosition();

    position.castlingRights =
      CastlingRights.BlackKingSide | CastlingRights.BlackQueenSide;

    position.board.setPiece(
      Square.fromAlgebraic('a8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    position.board.setPiece(
      Square.fromAlgebraic('b7'),
      new Piece(Color.White, PieceType.Bishop),
    );

    const game = new Game(position);

    game.play(
      new Move(
        Square.fromAlgebraic('b7'),
        Square.fromAlgebraic('a8'),
        MoveType.Capture,
      ),
    );

    expect(position.castlingRights).toBe(CastlingRights.BlackKingSide);
  });

  it('removes Black kingside castling rights when the h8 rook is captured', () => {
    const position = createBasicPosition();

    position.castlingRights =
      CastlingRights.BlackKingSide | CastlingRights.BlackQueenSide;

    position.board.setPiece(
      Square.fromAlgebraic('h8'),
      new Piece(Color.Black, PieceType.Rook),
    );

    position.board.setPiece(
      Square.fromAlgebraic('g7'),
      new Piece(Color.White, PieceType.Bishop),
    );

    const game = new Game(position);

    game.play(
      new Move(
        Square.fromAlgebraic('g7'),
        Square.fromAlgebraic('h8'),
        MoveType.Capture,
      ),
    );

    expect(position.castlingRights).toBe(CastlingRights.BlackQueenSide);
  });
});

describe('threefold repetition', () => {
  it('records the initial position as an occurrence', () => {
    const game = createGame();

    expect(game.isThreefoldRepetition()).toBe(false);
  });

  it('detects a position occurring three times', () => {
    const game = createGame();

    game.play(move('g1', 'f3'));
    game.play(move('g8', 'f6'));
    game.play(move('f3', 'g1'));
    game.play(move('f6', 'g8'));

    game.play(move('g1', 'f3'));
    game.play(move('g8', 'f6'));
    game.play(move('f3', 'g1'));
    game.play(move('f6', 'g8'));

    expect(game.isThreefoldRepetition()).toBe(true);
  });

  it('reports the current game status', () => {
    const game = createGame();

    expect(game.getStatus()).toBe(GameStatus.InProgress);
  });

  it('rejects moves after checkmate', () => {
    const game = createCheckmateGame();

    expect(game.getStatus()).toBe(GameStatus.Checkmate);

    expect(() => game.play(move('h8', 'h7'))).toThrow(
      'Cannot play move: game is checkmate',
    );
  });

  it('rejects moves after stalemate', () => {
    const game = createStalemateGame();

    expect(game.getStatus()).toBe(GameStatus.Stalemate);

    expect(() => game.play(move('h8', 'h7'))).toThrow(
      'Cannot play move: game is stalemate',
    );
  });
});
