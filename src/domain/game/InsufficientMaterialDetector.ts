import { Square } from '../board/Square.js';
import { Piece } from '../pieces/Piece.js';
import { PieceType } from '../pieces/PieceType.js';
import { Position } from './Position.js';

export class InsufficientMaterialDetector {
  public isInsufficientMaterial(position: Position): boolean {
    const pieces = this.getNonKingPieces(position);

    if (pieces.length === 0) {
      return true;
    }

    if (pieces.length === 1) {
      const piece = pieces[0];

      return (
        piece !== undefined &&
        (piece.type === PieceType.Bishop || piece.type === PieceType.Knight)
      );
    }

    if (
      pieces.length === 2 &&
      pieces.every((piece) => piece.type === PieceType.Bishop)
    ) {
      const bishopSquares = this.getBishopSquares(position);
      const firstBishop = bishopSquares[0];
      const secondBishop = bishopSquares[1];

      if (firstBishop === undefined || secondBishop === undefined) {
        return false;
      }

      return this.isSameColorSquare(firstBishop, secondBishop);
    }

    return false;
  }

  private getNonKingPieces(position: Position): Piece[] {
    const pieces: Piece[] = [];

    for (let index = 0; index < 64; index++) {
      const square = Square.fromIndex(index);
      const piece = position.board.getPiece(square);

      if (piece !== null && piece.type !== PieceType.King) {
        pieces.push(piece);
      }
    }

    return pieces;
  }

  private getBishopSquares(position: Position): Square[] {
    const squares: Square[] = [];

    for (let index = 0; index < 64; index++) {
      const square = Square.fromIndex(index);
      const piece = position.board.getPiece(square);

      if (piece?.type === PieceType.Bishop) {
        squares.push(square);
      }
    }

    return squares;
  }

  private isSameColorSquare(first: Square, second: Square): boolean {
    return (first.file + first.rank) % 2 === (second.file + second.rank) % 2;
  }
}
