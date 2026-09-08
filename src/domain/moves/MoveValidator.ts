import { Position } from '../game/Position.js';
import { MoveGenerator } from './MoveGenerator.js';
import { Move } from './Move.js';
import { MoveApplier } from './MoveApplier.js';
import { CheckDetector } from '../game/CheckDetector.js';
import { Square } from '../board/Square.js';
import { Board } from '../board/Board.js';
import { PieceType } from '../pieces/PieceType.js';
import { MoveType } from './MoveType.js';
import { Color } from '../pieces/Color.js';
import { CastlingRights } from '../game/CastlingRights.js';
import { AttackDetector } from './AttackDetector.js';

export class MoveValidator {
  private readonly moveGenerator: MoveGenerator;
  private readonly moveApplier: MoveApplier;
  private readonly checkDetector: CheckDetector;
  private readonly attackDetector: AttackDetector;

  public constructor(
    moveGenerator: MoveGenerator = new MoveGenerator(),
    moveApplier: MoveApplier = new MoveApplier(),
    checkDetector: CheckDetector = new CheckDetector(),
    attackDetector: AttackDetector = new AttackDetector(),
  ) {
    this.moveGenerator = moveGenerator;
    this.moveApplier = moveApplier;
    this.checkDetector = checkDetector;
    this.attackDetector = attackDetector;
  }

  public isLegal(position: Position, move: Move): boolean {
    if (!this.hasCastlingRights(position, move)) {
      return false;
    }

    if (!this.hasValidCastlingPieces(position, move)) {
      return false;
    }

    if (!this.areCastlingSquaresEmpty(position, move)) {
      return false;
    }

    if (this.isCastlingThroghCheck(position, move)) {
      return false;
    }

    if (this.isCapturingKing(position, move)) {
      return false;
    }

    if (!this.isValidPromotion(position, move)) {
      return false;
    }

    if (!this.isValidEnPassant(position, move)) {
      return false;
    }

    if (!this.isGeneratedMove(position, move)) {
      return false;
    }

    const temporaryPosition = this.createTemporaryPosition(position);

    this.moveApplier.apply(temporaryPosition, move);

    return !this.checkDetector.isInCheck(
      temporaryPosition,
      position.sideToMove,
    );
  }

  private isGeneratedMove(position: Position, move: Move): boolean {
    const generatedMoves = this.moveGenerator.generateMoves(position);

    return generatedMoves.some(
      (generatedMove) =>
        generatedMove.from.index === move.from.index &&
        generatedMove.to.index === move.to.index &&
        generatedMove.type === move.type &&
        generatedMove.promotion === move.promotion,
    );
  }

  private createTemporaryPosition(position: Position): Position {
    const board = new Board();

    for (let index = 0; index < 64; index++) {
      const square = Square.fromIndex(index);
      const piece = position.board.getPiece(square);

      if (piece !== null) {
        board.setPiece(square, piece);
      }
    }

    return new Position(
      board,
      position.sideToMove,
      position.castlingRights,
      position.enPassantSquare,
      position.halfmoveClock,
      position.fullmoveNumber,
    );
  }

  private isCapturingKing(position: Position, move: Move): boolean {
    const targetPiece = position.board.getPiece(move.to);

    return targetPiece !== null && targetPiece.type === PieceType.King;
  }

  private isValidPromotion(position: Position, move: Move): boolean {
    if (move.type !== MoveType.Promotion) {
      return true;
    }

    const piece = position.board.getPiece(move.from);

    if (
      piece === null ||
      piece.type !== PieceType.Pawn ||
      move.promotion === null
    ) {
      return false;
    }

    const promotionRank = piece.color === Color.White ? 7 : 0;

    if (move.to.rank !== promotionRank) {
      return false;
    }

    return (
      move.promotion === PieceType.Queen ||
      move.promotion === PieceType.Rook ||
      move.promotion === PieceType.Bishop ||
      move.promotion === PieceType.Knight
    );
  }

  private isValidEnPassant(position: Position, move: Move): boolean {
    if (move.type !== MoveType.EnPassant) {
      return true;
    }

    if (position.enPassantSquare === null) {
      return false;
    }

    if (move.to.index !== position.enPassantSquare.index) {
      return false;
    }

    const pawn = position.board.getPiece(move.from);

    if (pawn === null || pawn.type !== PieceType.Pawn) {
      return false;
    }

    const capturedPawnSquare = Square.fromIndex(
      move.to.index + (pawn.color === Color.White ? -8 : 8),
    );

    const capturedPawn = position.board.getPiece(capturedPawnSquare);

    return (
      capturedPawn !== null &&
      capturedPawn.type === PieceType.Pawn &&
      capturedPawn.color !== pawn.color
    );
  }

  private hasCastlingRights(position: Position, move: Move): boolean {
    switch (move.type) {
      case MoveType.CastlingKingSide:
        return position.sideToMove === Color.White
          ? (position.castlingRights & CastlingRights.WhiteKingSide) !== 0
          : (position.castlingRights & CastlingRights.BlackKingSide) !== 0;

      case MoveType.CastlingQueenSide:
        return position.sideToMove === Color.White
          ? (position.castlingRights & CastlingRights.WhiteQueenSide) !== 0
          : (position.castlingRights & CastlingRights.BlackQueenSide) !== 0;

      default:
        return true;
    }
  }

  private hasValidCastlingPieces(position: Position, move: Move): boolean {
    if (
      move.type !== MoveType.CastlingKingSide &&
      move.type !== MoveType.CastlingQueenSide
    ) {
      return true;
    }

    const isWhite = position.sideToMove === Color.White;

    const expectedKingSquare = Square.fromAlgebraic(isWhite ? 'e1' : 'e8');

    const expectedRookSquare = Square.fromAlgebraic(
      move.type === MoveType.CastlingKingSide
        ? isWhite
          ? 'h1'
          : 'h8'
        : isWhite
          ? 'a1'
          : 'a8',
    );

    const expectedDestination = Square.fromAlgebraic(
      move.type === MoveType.CastlingKingSide
        ? isWhite
          ? 'g1'
          : 'g8'
        : isWhite
          ? 'c1'
          : 'c8',
    );

    if (move.from.index !== expectedKingSquare.index) {
      return false;
    }

    if (move.to.index !== expectedDestination.index) {
      return false;
    }

    const king = position.board.getPiece(expectedKingSquare);
    const rook = position.board.getPiece(expectedRookSquare);

    return (
      king !== null &&
      king.color === position.sideToMove &&
      king.type === PieceType.King &&
      rook !== null &&
      rook.color === position.sideToMove &&
      rook.type === PieceType.Rook
    );
  }

  private areCastlingSquaresEmpty(position: Position, move: Move): boolean {
    if (
      move.type !== MoveType.CastlingKingSide &&
      move.type !== MoveType.CastlingQueenSide
    ) {
      return true;
    }

    const isWhite = position.sideToMove === Color.White;

    const squares =
      move.type === MoveType.CastlingKingSide
        ? isWhite
          ? ['f1', 'g1']
          : ['f8', 'g8']
        : isWhite
          ? ['b1', 'c1', 'd1']
          : ['b8', 'c8', 'd8'];

    return squares.every(
      (algebraic) =>
        position.board.getPiece(Square.fromAlgebraic(algebraic)) === null,
    );
  }

  private isCastlingThroghCheck(position: Position, move: Move): boolean {
    if (
      move.type !== MoveType.CastlingKingSide &&
      move.type !== MoveType.CastlingQueenSide
    ) {
      return false;
    }

    const opponent =
      position.sideToMove === Color.White ? Color.Black : Color.White;

    const isWhite = position.sideToMove === Color.White;

    const kingSquare = Square.fromAlgebraic(isWhite ? 'e1' : 'e8');

    const transitSquare = Square.fromAlgebraic(
      move.type === MoveType.CastlingKingSide
        ? isWhite
          ? 'f1'
          : 'f8'
        : isWhite
          ? 'd1'
          : 'd8',
    );

    const destinationSquare = Square.fromAlgebraic(
      move.type === MoveType.CastlingKingSide
        ? isWhite
          ? 'g1'
          : 'g8'
        : isWhite
          ? 'c1'
          : 'c8',
    );

    return (
      this.attackDetector.isSquareAttacked(position, kingSquare, opponent) ||
      this.attackDetector.isSquareAttacked(position, transitSquare, opponent) ||
      this.attackDetector.isSquareAttacked(
        position,
        destinationSquare,
        opponent,
      )
    );
  }
}
