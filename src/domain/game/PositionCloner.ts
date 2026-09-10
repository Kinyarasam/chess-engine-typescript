import { Board } from '../board/Board.js';
import { Square } from '../board/Square.js';
import { Piece } from '../pieces/Piece.js';
import { Position } from './Position.js';

export class PositionCloner {
  public static clone(position: Position): Position {
    const board = new Board();

    for (let index = 0; index < 64; index++) {
      const square = Square.fromIndex(index);
      const piece = position.board.getPiece(square);

      if (piece !== null) {
        board.setPiece(square, new Piece(piece.color, piece.type));
      }
    }

    return new Position(
      board,
      position.sideToMove,
      position.castlingRights,
      position.enPassantSquare === null
        ? null
        : Square.fromIndex(position.enPassantSquare.index),
      position.halfmoveClock,
      position.fullmoveNumber,
    );
  }
}
