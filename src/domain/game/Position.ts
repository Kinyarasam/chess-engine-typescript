import { Board } from '../board/Board.js';
import { Square } from '../board/Square.js';
import { Color } from '../pieces/Color.js';
import { CastlingRights } from './CastlingRights.js';

export class Position {
  public readonly board: Board;
  public sideToMove: Color;
  public castlingRights: CastlingRights;
  public enPassantSquare: Square | null;
  public halfmoveClock: number;
  public fullmoveNumber: number;

  public constructor(
    board: Board = new Board(),
    sideToMove: Color = Color.White,
    castlingRights: CastlingRights = CastlingRights.None,
    enPassantSquare: Square | null = null,
    halfmoveClock: number = 0,
    fullmoveNumber: number = 1,
  ) {
    if (halfmoveClock < 0 || !Number.isInteger(halfmoveClock)) {
      throw new RangeError(`Invalid halfmove clock: ${halfmoveClock}`);
    }

    if (fullmoveNumber < 1 || !Number.isInteger(fullmoveNumber)) {
      throw new RangeError(`Invalid fullmove number: ${fullmoveNumber}`);
    }

    this.board = board;
    this.sideToMove = sideToMove;
    this.castlingRights = castlingRights;
    this.enPassantSquare = enPassantSquare;
    this.halfmoveClock = halfmoveClock;
    this.fullmoveNumber = fullmoveNumber;
  }
}
