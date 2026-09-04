import { Square } from '../board/Square.js';
import type { Position } from '../game/Position.js';
import { Color } from '../pieces/Color.js';
import { PieceType } from '../pieces/PieceType.js';

export class AttackDetector {
  public isSquareAttacked(
    position: Position,
    square: Square,
    byColor: Color,
  ): boolean {
    return (
      this.isAttackedByOrthogonalSlider(position, square, byColor) ||
      this.isAttackedByDiagonalSlider(position, square, byColor) ||
      this.isAttackedByKnight(position, square, byColor) ||
      this.isAttackedByPawn(position, square, byColor) ||
      this.isAttackedByKing(position, square, byColor)
    );
  }

  private isOnBoard(file: number, rank: number): boolean {
    return file >= 0 && file < 8 && rank >= 0 && rank < 8;
  }

  private isAttackedByDiagonalSlider(
    position: Position,
    square: Square,
    byColor: Color,
  ): boolean {
    const board = position.board;

    const directions = [
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1],
    ] as const;

    for (const [fileOffset, rankOffset] of directions) {
      let file = square.file + fileOffset;
      let rank = square.rank + rankOffset;

      while (this.isOnBoard(file, rank)) {
        const currentSquare = Square.fromIndex(rank * 8 + file);

        const piece = board.getPiece(currentSquare);

        if (piece === null) {
          file += fileOffset;
          rank += rankOffset;
          continue;
        }

        if (
          (piece.color === byColor && piece.type === PieceType.Bishop) ||
          piece.type === PieceType.Queen
        ) {
          return true;
        }

        break;
      }
    }

    return false;
  }

  private isAttackedByOrthogonalSlider(
    position: Position,
    square: Square,
    byColor: Color,
  ): boolean {
    const board = position.board;

    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const;

    for (const [fileOffset, rankOffset] of directions) {
      let file = square.file + fileOffset;
      let rank = square.rank + rankOffset;

      while (this.isOnBoard(file, rank)) {
        const currentSquare = Square.fromIndex(rank * 8 + file);

        const piece = board.getPiece(currentSquare);

        if (piece === null) {
          file += fileOffset;
          rank += rankOffset;
          continue;
        }

        if (
          (piece.color === byColor && piece.type === PieceType.Rook) ||
          piece.type === PieceType.Queen
        ) {
          return true;
        }

        break;
      }
    }

    return false;
  }

  private isAttackedByKnight(
    position: Position,
    square: Square,
    byColor: Color,
  ): boolean {
    const knightOffsets = [
      [1, 2],
      [2, 1],
      [2, -1],
      [1, -2],
      [-1, -2],
      [-2, -1],
      [-2, 1],
      [-1, 2],
    ] as const;

    const board = position.board;

    for (const [fileOffset, rankOffset] of knightOffsets) {
      const file = square.file + fileOffset;
      const rank = square.rank + rankOffset;

      if (!this.isOnBoard(file, rank)) {
        continue;
      }

      const currentSquare = Square.fromIndex(rank * 8 + file);

      const piece = board.getPiece(currentSquare);

      if (
        piece !== null &&
        piece.color === byColor &&
        piece.type === PieceType.Knight
      ) {
        return true;
      }
    }

    return false;
  }

  private isAttackedByPawn(
    position: Position,
    square: Square,
    byColor: Color,
  ): boolean {
    const board = position.board;

    const pawnRank = square.rank + (byColor === Color.White ? -1 : 1);

    if (pawnRank < 0 || pawnRank >= 8) {
      return false;
    }

    const pawnFiles = [square.file - 1, square.file + 1];

    for (const file of pawnFiles) {
      if (!this.isOnBoard(file, pawnRank)) {
        continue;
      }

      const pawnSquare = Square.fromIndex(pawnRank * 8 + file);

      const piece = board.getPiece(pawnSquare);

      if (
        piece !== null &&
        piece.color === byColor &&
        piece.type === PieceType.Pawn
      ) {
        return true;
      }
    }

    return false;
  }

  private isAttackedByKing(
    position: Position,
    square: Square,
    byColor: Color,
  ): boolean {
    const kingOffsets = [
      [1, 1],
      [1, 0],
      [1, -1],
      [0, 1],
      [0, -1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ] as const;

    const board = position.board;

    for (const [fileOffset, rankOffset] of kingOffsets) {
      const file = square.file + fileOffset;
      const rank = square.rank + rankOffset;

      if (!this.isOnBoard(file, rank)) {
        continue;
      }

      const currentSquare = Square.fromIndex(rank * 8 + file);

      const piece = board.getPiece(currentSquare);

      if (
        piece !== null &&
        piece.color === byColor &&
        piece.type === PieceType.King
      ) {
        return true;
      }
    }

    return false;
  }
}
