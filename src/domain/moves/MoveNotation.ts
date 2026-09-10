import { Board } from '../board/Board.js';
import { Square } from '../board/Square.js';
import { CheckDetector } from '../game/CheckDetector.js';
import { Position } from '../game/Position.js';
import { Color } from '../pieces/Color.js';
import { Piece } from '../pieces/Piece.js';
import { PieceType } from '../pieces/PieceType.js';
import { LegalMoveGenerator } from './LegalMoveGenerator.js';
import type { Move } from './Move.js';
import { MoveApplier } from './MoveApplier.js';
import { MoveType } from './MoveType.js';

export class MoveNotation {
  private readonly legalMoveGenerator: LegalMoveGenerator;
  private readonly moveApplier: MoveApplier;
  private readonly checkDetector: CheckDetector;

  public constructor(
    legalMoveGenerator: LegalMoveGenerator = new LegalMoveGenerator(),
    moveApplier: MoveApplier = new MoveApplier(),
    checkDetector: CheckDetector = new CheckDetector(),
  ) {
    this.legalMoveGenerator = legalMoveGenerator;
    this.checkDetector = checkDetector;
    this.moveApplier = moveApplier;
  }

  private static readonly PIECE_SYMBOLS: Record<PieceType, string> = {
    [PieceType.Pawn]: 'P',
    [PieceType.Knight]: 'N',
    [PieceType.Bishop]: 'B',
    [PieceType.Rook]: 'R',
    [PieceType.Queen]: 'Q',
    [PieceType.King]: 'K',
  };

  public toCoordinateNotation(move: Move): string {
    const from = move.from.toAlgebraic();
    const to = move.to.toAlgebraic();

    if (move.type === MoveType.Promotion) {
      if (move.promotion === null) {
        throw new Error(`Cannot format promotion move without promotion piece`);
      }

      const promotionSymbol = MoveNotation.PIECE_SYMBOLS[move.promotion];

      return `${from}-${to}=${promotionSymbol}`;
    }

    return `${from}-${to}`;
  }

  public toSan(position: Position, move: Move): string {
    let notation: string;

    if (move.type === MoveType.CastlingKingSide) {
      notation = 'O-O';
    } else if (move.type === MoveType.CastlingQueenSide) {
      notation = 'O-O-O';
    } else {
      const piece = position.board.getPiece(move.from);

      if (piece === null) {
        throw new Error(
          `Cannot format move: no piece on ${move.from.toAlgebraic()}`,
        );
      }

      const destination = move.to.toAlgebraic();
      const isCapture =
        move.type === MoveType.Capture ||
        (move.type === MoveType.Promotion &&
          position.board.getPiece(move.to) !== null);

      if (piece.type === PieceType.Pawn) {
        const promotionSymbol =
          move.promotion === null
            ? ''
            : `=${MoveNotation.PIECE_SYMBOLS[move.promotion]}`;

        if (isCapture) {
          notation = `${move.from.toAlgebraic()[0]}x${destination}${promotionSymbol}`;
        } else {
          notation = `${destination}${promotionSymbol}`;
        }
      } else {
        const pieceSymbol = MoveNotation.PIECE_SYMBOLS[piece.type];
        const disambiguation = this.getDisambiguation(position, move);

        notation = `${pieceSymbol}${disambiguation}${isCapture ? 'x' : ''}${destination}`;
      }
    }

    return `${notation}${this.getCheckSuffix(position, move)}`;
  }

  private getDisambiguation(position: Position, move: Move): string {
    const piece = position.board.getPiece(move.from);

    if (
      piece === null ||
      piece.type === PieceType.Pawn ||
      piece.type === PieceType.King
    ) {
      return '';
    }

    const legalMoves = this.legalMoveGenerator.generateMoves(position);

    const competingMoves = legalMoves.filter((candidate) => {
      if (
        candidate.from.index === move.from.index ||
        candidate.to.index !== move.to.index
      ) {
        return false;
      }

      const candidatePiece = position.board.getPiece(candidate.from);

      return (
        candidatePiece !== null &&
        candidatePiece.color === piece.color &&
        candidatePiece.type === piece.type
      );
    });

    if (competingMoves.length === 0) {
      return '';
    }

    const sameFile = competingMoves.some(
      (candidate) => candidate.from.file === move.from.file,
    );

    if (!sameFile) {
      return String.fromCharCode('a'.charCodeAt(0) + move.from.file);
    }

    const sameRank = competingMoves.some(
      (candidate) => candidate.from.rank === move.from.rank,
    );

    if (!sameRank) {
      return String(move.from.rank + 1);
    }

    return move.from.toAlgebraic();
  }

  private getCheckSuffix(position: Position, move: Move): string {
    const nextPosition = this.clonePosition(position);

    this.moveApplier.apply(nextPosition, move);

    const opponent =
      position.sideToMove === Color.White ? Color.Black : Color.White;

    nextPosition.sideToMove = opponent;

    const isInCheck = this.checkDetector.isInCheck(nextPosition, opponent);

    if (!isInCheck) {
      return '';
    }

    const hasLegalMoves =
      this.legalMoveGenerator.generateMoves(nextPosition).length > 0;

    return hasLegalMoves ? '+' : '#';
  }

  private clonePosition(position: Position): Position {
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
