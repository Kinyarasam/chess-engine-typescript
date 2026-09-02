import { Board } from '../../domain/board/Board.js';
import { Square } from '../../domain/board/Square.js';
import { Color } from '../../domain/pieces/Color.js';
import { Piece } from '../../domain/pieces/Piece.js';
import { PieceType } from '../../domain/pieces/PieceType.js';
import { CastlingRights } from '../../domain/game/CastlingRights.js';
import { Position } from '../../domain/game/Position.js';

export class FenParser {
  public static parse(fen: string): Position {
    const fields = fen.trim().split(/\s+/);

    if (fields.length !== 6) {
      throw new Error('Invalid FEN: expected 6 fields');
    }

    const boardField = fields[0];
    const sideField = fields[1];
    const castlingField = fields[2];
    const enPassantField = fields[3];
    const halfmoveField = fields[4];
    const fullmoveField = fields[5];

    if (
      boardField === undefined ||
      sideField === undefined ||
      castlingField === undefined ||
      enPassantField === undefined ||
      halfmoveField === undefined ||
      fullmoveField === undefined
    ) {
      throw new Error('Invalid FEN: missing fields');
    }

    const board = FenParser.parseBoard(boardField);
    const sideToMove = FenParser.parseSideToMove(sideField);
    const castlingRights = FenParser.parseCastlingRights(castlingField);
    const enPassantSquare = FenParser.parseEnPassantSquare(enPassantField);

    const halfmoveClock = FenParser.parseMoveCounter(
      halfmoveField,
      'halfmove clock',
      0,
    );

    const fullmoveNumber = FenParser.parseMoveCounter(
      fullmoveField,
      'fullmove number',
      1,
    );

    return new Position(
      board,
      sideToMove,
      castlingRights,
      enPassantSquare,
      halfmoveClock,
      fullmoveNumber,
    );
  }

  private static parseBoard(boardField: string): Board {
    const ranks = boardField.split('/');

    if (ranks.length !== 8) {
      throw new Error('Invalid FEN board: expected 8 ranks');
    }

    const board = new Board();

    for (let rank = 0; rank < 8; rank += 1) {
      const rankData = ranks[rank];

      if (rankData === undefined) {
        throw new Error('Invalid FEN board rank');
      }

      let file = 0;

      for (const character of rankData) {
        if (file >= 8) {
          throw new Error(
            'Invalid FEN board: rank contains more than 8 squares',
          );
        }

        if (/^[1-8]$/.test(character)) {
          file += Number(character);
          continue;
        }

        const piece = FenParser.parsePiece(character);

        if (piece === null) {
          throw new Error(`Invalid FEN board piece: ${character}`);
        }

        const boardRank = 7 - rank;
        const square = Square.fromIndex(boardRank * 8 + file);

        board.setPiece(square, piece);
        file += 1;
      }

      if (file !== 8) {
        throw new Error('Invalid FEN board: rank does not contain 8 squares');
      }
    }

    return board;
  }

  private static parsePiece(character: string): Piece | null {
    const pieces: Record<string, Piece> = {
      P: new Piece(Color.White, PieceType.Pawn),
      N: new Piece(Color.White, PieceType.Knight),
      B: new Piece(Color.White, PieceType.Bishop),
      R: new Piece(Color.White, PieceType.Rook),
      Q: new Piece(Color.White, PieceType.Queen),
      K: new Piece(Color.White, PieceType.King),

      p: new Piece(Color.Black, PieceType.Pawn),
      n: new Piece(Color.Black, PieceType.Knight),
      b: new Piece(Color.Black, PieceType.Bishop),
      r: new Piece(Color.Black, PieceType.Rook),
      q: new Piece(Color.Black, PieceType.Queen),
      k: new Piece(Color.Black, PieceType.King),
    };

    return pieces[character] ?? null;
  }

  private static parseSideToMove(side: string): Color {
    if (side === 'w') {
      return Color.White;
    }

    if (side === 'b') {
      return Color.Black;
    }

    throw new Error(`Invalid FEN side to move: ${side}`);
  }

  private static parseCastlingRights(value: string): CastlingRights {
    if (value === '-') {
      return CastlingRights.None;
    }

    let rights = CastlingRights.None;

    for (const character of value) {
      switch (character) {
        case 'K':
          rights |= CastlingRights.WhiteKingSide;
          break;
        case 'Q':
          rights |= CastlingRights.WhiteQueenSide;
          break;
        case 'k':
          rights |= CastlingRights.BlackKingSide;
          break;
        case 'q':
          rights |= CastlingRights.BlackQueenSide;
          break;
        default:
          throw new Error(`Invalid FEN castling rights: ${value}`);
      }
    }

    return rights;
  }

  private static parseEnPassantSquare(value: string): Square | null {
    if (value === '-') {
      return null;
    }

    return Square.fromAlgebraic(value);
  }

  private static parseMoveCounter(
    value: string,
    fieldName: string,
    minimum: number,
  ): number {
    if (!/^\d+$/.test(value)) {
      throw new Error(`Invalid FEN ${fieldName}: ${value}`);
    }

    const parsed = Number(value);

    if (parsed < minimum) {
      throw new Error(`Invalid FEN ${fieldName}: ${value}`);
    }

    return parsed;
  }
}
