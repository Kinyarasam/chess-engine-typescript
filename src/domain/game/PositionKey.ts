import { Square } from '../board/Square.js';
import { Color } from '../pieces/Color.js';
import { PieceType } from '../pieces/PieceType.js';
import type { Position } from './Position.js';

export class PositionKey {
  private static readonly PIECE_KEYS: Record<PieceType, string> = {
    [PieceType.Pawn]: 'p',
    [PieceType.Knight]: 'n',
    [PieceType.Bishop]: 'b',
    [PieceType.Rook]: 'r',
    [PieceType.Queen]: 'q',
    [PieceType.King]: 'k',
  };

  public static from(position: Position): string {
    const boardKey = PositionKey.getBoardKey(position);
    const sideKey = position.sideToMove;
    const castlingKey = position.castlingRights;
    const enPassantKey = position.enPassantSquare?.toAlgebraic() ?? '-';

    return [boardKey, sideKey, castlingKey, enPassantKey].join('|');
  }

  private static getBoardKey(position: Position): string {
    const pieces: string[] = [];

    for (let index = 0; index < 64; index++) {
      const square = Square.fromIndex(index);
      const piece = position.board.getPiece(square);

      if (piece === null) {
        pieces.push('-');
        continue;
      }

      const colorKey = piece.color === Color.White ? 'w' : 'b';

      const pieceKey = PositionKey.PIECE_KEYS[piece.type];

      pieces.push(`${colorKey}${pieceKey}`);
    }

    return pieces.join('');
  }
}
