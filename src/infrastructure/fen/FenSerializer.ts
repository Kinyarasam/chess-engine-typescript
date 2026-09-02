import { Board } from '../../domain/board/Board.js';
import { Square } from '../../domain/board/Square.js';
import { Color } from '../../domain/pieces/Color.js';
import { Piece } from '../../domain/pieces/Piece.js';
import { PieceType } from '../../domain/pieces/PieceType.js';
import { CastlingRights } from '../../domain/game/CastlingRights.js';
import { Position } from '../../domain/game/Position.js';

export class FenSerializer {
  public static serialize(position: Position): string {
    const board = FenSerializer.serializeBoard(position.board);
    const sideToMove = FenSerializer.serializeSideToMove(position.sideToMove);
    const castlingRights = FenSerializer.serializeCastlingRights(
      position.castlingRights,
    );
    const enPassantSquare = position.enPassantSquare?.toAlgebraic() ?? '-';

    return [
      board,
      sideToMove,
      castlingRights,
      enPassantSquare,
      position.halfmoveClock,
      position.fullmoveNumber,
    ].join(' ');
  }

  private static serializeBoard(board: Board): string {
    const ranks: string[] = [];

    for (let rank = 7; rank >= 0; rank -= 1) {
      let rankData = '';
      let emptySquares = 0;

      for (let file = 0; file < 8; file += 1) {
        const square = Square.fromIndex(rank * 8 + file);

        const piece = board.getPiece(square);

        if (piece === null) {
          emptySquares += 1;
          continue;
        }

        if (emptySquares > 0) {
          rankData += String(emptySquares);
          emptySquares = 0;
        }

        rankData += FenSerializer.serializePiece(piece);
      }

      if (emptySquares > 0) {
        rankData += String(emptySquares);
      }

      ranks.push(rankData);
    }

    return ranks.join('/');
  }

  private static serializePiece(piece: Piece): string {
    const symbols: Record<PieceType, string> = {
      [PieceType.Pawn]: 'p',
      [PieceType.Knight]: 'n',
      [PieceType.Bishop]: 'b',
      [PieceType.Rook]: 'r',
      [PieceType.Queen]: 'q',
      [PieceType.King]: 'k',
    };

    const symbol = symbols[piece.type];

    return piece.color === Color.White ? symbol.toUpperCase() : symbol;
  }

  private static serializeSideToMove(color: Color): string {
    return color === Color.White ? 'w' : 'b';
  }

  private static serializeCastlingRights(rights: CastlingRights): string {
    let result = '';

    if (rights & CastlingRights.WhiteKingSide) {
      result += 'K';
    }

    if (rights & CastlingRights.WhiteQueenSide) {
      result += 'Q';
    }

    if (rights & CastlingRights.BlackKingSide) {
      result += 'k';
    }

    if (rights & CastlingRights.BlackQueenSide) {
      result += 'q';
    }

    return result || '-';
  }
}
