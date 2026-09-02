import { Board } from '../board/Board.js';
import { Square } from '../board/Square.js';
import { Color } from '../pieces/Color.js';
import { PieceType } from '../pieces/PieceType.js';
import { Move } from './Move.js';
import { MoveType } from './MoveType.js';
import type { Position } from '../game/Position.js';

export class MoveGenerator {
  public generateMoves(position: Position): Move[] {
    const moves: Move[] = [];

    for (let index = 0; index < 64; index++) {
      const square = Square.fromIndex(index);
      const piece = position.board.getPiece(square);

      if (piece === null) {
        continue;
      }

      if (piece.color !== position.sideToMove) {
        continue;
      }

      moves.push(...this.generatePieceMoves(position.board, square));
    }

    return moves;
  }

  public generatePieceMoves(board: Board, square: Square): Move[] {
    const piece = board.getPiece(square);

    if (piece === null) {
      return [];
    }

    switch (piece.type) {
      case PieceType.Pawn:
        return this.generatePawnMoves(board, square);

      case PieceType.Knight:
        return this.generateKnightMoves(board, square);

      case PieceType.Bishop:
        return this.generateBishopMoves(board, square);

      case PieceType.Rook:
        return this.generateRookMoves(board, square);

      case PieceType.King:
        return this.generateKingMoves(board, square);

      case PieceType.Queen:
        return this.generateQueenMoves(board, square);
    }
  }

  public generateKingMoves(board: Board, square: Square): Move[] {
    const piece = board.getPiece(square);

    if (piece === null || piece.type !== PieceType.King) {
      return [];
    }

    const moves: Move[] = [];

    const directions = [
      // Diagnals
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],

      // Straight lines
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const;

    for (const [fileOffset, rankOffset] of directions) {
      const targetFile = square.file + fileOffset;
      const targetRank = square.rank + rankOffset;

      if (!this.isOnBoard(targetFile, targetRank)) {
        continue;
      }

      const target = Square.fromIndex(targetRank * 8 + targetFile);

      const targetPiece = board.getPiece(target);

      if (targetPiece === null) {
        moves.push(new Move(square, target));
        continue;
      }

      if (targetPiece.color !== piece.color) {
        moves.push(new Move(square, target, MoveType.Capture));
      }
    }

    return moves;
  }

  public generateQueenMoves(board: Board, square: Square): Move[] {
    const piece = board.getPiece(square);

    if (piece === null || piece.type !== PieceType.Queen) {
      return [];
    }

    return this.generateSlidingMoves(board, square, [
      // Diagnals
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],

      // Straight lines
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]);
  }

  public generateBishopMoves(board: Board, square: Square): Move[] {
    const piece = board.getPiece(square);

    if (piece === null || piece.type !== PieceType.Bishop) {
      return [];
    }

    return this.generateSlidingMoves(board, square, [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]);
  }

  public generateRookMoves(board: Board, square: Square): Move[] {
    const piece = board.getPiece(square);

    if (piece === null || piece.type !== PieceType.Rook) {
      return [];
    }

    return this.generateSlidingMoves(board, square, [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]);
  }

  public generateKnightMoves(board: Board, square: Square): Move[] {
    const piece = board.getPiece(square);

    if (piece === null || piece.type !== PieceType.Knight) {
      return [];
    }

    const moves: Move[] = [];

    const offsets = [
      [1, 2],
      [2, 1],
      [-1, 2],
      [-2, 1],
      [1, -2],
      [2, -1],
      [-1, -2],
      [-2, -1],
    ] as const;

    for (const [fileOffset, rankOffset] of offsets) {
      const targetFile = square.file + fileOffset;
      const targetRank = square.rank + rankOffset;

      if (!this.isOnBoard(targetFile, targetRank)) {
        continue;
      }

      const target = Square.fromIndex(targetRank * 8 + targetFile);

      const targetPiece = board.getPiece(target);

      if (targetPiece === null) {
        moves.push(new Move(square, target));
        continue;
      }

      if (targetPiece.color !== piece.color) {
        moves.push(new Move(square, target, MoveType.Capture));
      }
    }

    return moves;
  }

  public generatePawnMoves(board: Board, square: Square): Move[] {
    const piece = board.getPiece(square);

    if (piece === null || piece.type !== PieceType.Pawn) {
      return [];
    }

    const direction = piece.color === Color.White ? 1 : -1;
    const startRank = piece.color === Color.White ? 1 : 6;

    const moves: Move[] = [];

    const oneStepRank = square.rank + direction;

    if (this.isOnBoard(square.file, oneStepRank)) {
      const oneStep = Square.fromIndex(oneStepRank * 8 + square.file);

      if (board.getPiece(oneStep) === null) {
        this.addPawnMove(square, oneStep, piece.color, moves);

        if (square.rank === startRank) {
          const twoStepRank = square.rank + 2 * direction;

          const twoStep = Square.fromIndex(twoStepRank * 8 + square.file);

          if (board.getPiece(twoStep) === null) {
            moves.push(new Move(square, twoStep));
          }
        }
      }
    }

    this.addPawnCapture(
      board,
      square,
      square.file - 1,
      oneStepRank,
      piece.color,
      moves,
    );

    this.addPawnCapture(
      board,
      square,
      square.file + 1,
      oneStepRank,
      piece.color,
      moves,
    );

    return moves;
  }

  private addPawnCapture(
    board: Board,
    from: Square,
    file: number,
    rank: number,
    color: Color,
    moves: Move[],
  ): void {
    if (!this.isOnBoard(file, rank)) {
      return;
    }

    const target = Square.fromIndex(rank * 8 + file);
    const targetPiece = board.getPiece(target);

    if (targetPiece !== null && targetPiece.color !== color) {
      const promotionRank = Color.White ? 7 : 0;

      if (target.rank === promotionRank) {
        this.addPromotionMoves(from, target, moves);
        return;
      }

      moves.push(new Move(from, target, MoveType.Capture));
    }
  }

  private isOnBoard(file: number, rank: number): boolean {
    return file >= 0 && file < 8 && rank >= 0 && rank < 8;
  }

  private generateSlidingMoves(
    board: Board,
    square: Square,
    directions: ReadonlyArray<readonly [number, number]>,
  ): Move[] {
    const piece = board.getPiece(square);

    if (piece === null) {
      return [];
    }

    const moves: Move[] = [];

    for (const [fileOffset, rankOffset] of directions) {
      let file = square.file + fileOffset;
      let rank = square.rank + rankOffset;

      while (this.isOnBoard(file, rank)) {
        const target = Square.fromIndex(rank * 8 + file);

        const targetPiece = board.getPiece(target);

        if (targetPiece === null) {
          moves.push(new Move(square, target));
        } else {
          if (targetPiece.color !== piece.color) {
            moves.push(new Move(square, target, MoveType.Capture));
          }

          break;
        }

        file += fileOffset;
        rank += rankOffset;
      }
    }

    return moves;
  }

  private addPawnMove(
    from: Square,
    to: Square,
    color: Color,
    moves: Move[],
  ): void {
    const promotionRank = color === Color.White ? 7 : 0;

    if (to.rank === promotionRank) {
      this.addPromotionMoves(from, to, moves);
      return;
    }

    moves.push(new Move(from, to));
  }

  private addPromotionMoves(from: Square, to: Square, moves: Move[]): void {
    const promotionPieces = [
      PieceType.Queen,
      PieceType.Rook,
      PieceType.Bishop,
      PieceType.Knight,
    ];

    for (const promotion of promotionPieces) {
      moves.push(new Move(from, to, MoveType.Promotion, promotion));
    }
  }
}
