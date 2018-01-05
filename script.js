var board;
var game = new Chess();
var undoFlag = 0;

var getPieceValue = function(piece){
	if(piece.color === 'w'){
		var bw = 1;
	}else if(piece.color === 'b'){
		var bw = -1;
	}
	if(piece.type === 'p'){
		return (bw *10);
	}
	if(piece.type === 'r'){
		return (bw *50);
	}
	if(piece.type === 'n'){
		return (bw *30);
	}
	if(piece.type === 'b'){
		return (bw *30);
	}
	if(piece.type === 'q'){
		return (bw *90);
	}
	if(piece.type === 'k'){
		return (bw *900);
	}	
	return 0;
};

var evaluateValue = function(game){
	var value=0;
	for(var i=1; i<=8; i++){
		for(var j=97; j<105; j++){
			var piece = game.get(String.fromCharCode(j)+i);
			if(piece)
			value = value + getPieceValue(piece);
		}
	}
	return value;
};

var calculateBestMove = function(){
	if(game.in_checkmate()){
		alert("gameOver");
		return 0;
	}else if(game.in_draw()){
		alert("Draw");
		return 0;
	}
	var bestVal = 9999;
	var possibleMoves = game.moves();
	var bestMove;

	for(var i=0; i<possibleMoves.length; i++){
		var move = possibleMoves[i];
		game.move(move);

		var value = evaluateValue(game);
		game.undo();
		if(value < bestVal){
			bestVal = value;
			bestMove = move;
		}
	}
	return bestMove;
};


var callForBestMove=function(depth,game, isWhite){
	var bestMove;
	var bestScore = 9999;
	var possibleMoves = game.moves();
	for(var i=0; i< possibleMoves.length; i++){
		var currentMove = possibleMoves[i];
		game.move(currentMove);
		var value = nextMove(depth-1, game, !isWhite, -9999, 9999);
		game.undo();
		if(value < bestScore){
			bestScore = value;
			bestMove = currentMove;
		}
	}
	return bestMove;
};

var nextMove = function(depth, game, isWhite, alpha, beta){
	if(depth <= 0){
		return evaluateValue(game);
	}
	var possibleMoves = game.moves();
	if(isWhite === true){
		var bestMove = -9999;
		for(var i=0; i< possibleMoves.length; i++){
			game.move(possibleMoves[i]);
			var bestMove = Math.max(bestMove, nextMove(depth-1, game, !isWhite, alpha, beta));
			game.undo(); 
			alpha = Math.max(alpha, bestMove);
			if(beta <= alpha){
				return bestMove;
			}
		}
		return bestMove;
	}else{
		var bestMove = 9999;
		for(var i=0; i< possibleMoves.length; i++){
			var currentMove = possibleMoves[i];
			game.move(currentMove);
			var bestMove = Math.min(bestMove, nextMove(depth-1, game, !isWhite, alpha, beta));
			game.undo(); 
			beta = Math.min(beta, bestMove);
			if(beta <= alpha){
				return bestMove;
			}
		}
		return bestMove;
	}
};

var takeNextMove = function(){
	undoFlag = 1;
	if(game.in_checkmate()){
		alert("GAME OVER");
	}
	if(game.in_stalemate() || game.in_draw()){
		alert("DRAW");
	}
	game.move(callForBestMove(4, game, false));
	board.position(game.fen());
	undoFlag = 0;
}

var makeRandomMove = function() {
	var possibleMoves = game.moves();

	if(game.game_over() === true || game.in_draw() === true || possibleMoves.length === 0){
		return;
	}
	var randomIndex = Math.floor(Math.random() * possibleMoves.length);
	game.move(possibleMoves[randomIndex]);
	board.position(game.fen());
	//window.setTimeout(makeRandomMove, 500);
}

var greySquare = function(square) {
  var squareEl = $('#board .square-' + square);
  
  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

var removeGreySquares = function() {
  $('#board .square-55d63').css('background', '');
};

var onDragStart = function(source, piece, position, orientation){
	if(game.in_checkmate() === true || game.in_draw() === true){
		return false;
	}
};

var onDrop = function(source, target, piece, newPos, oldPos, orientation){
	removeGreySquares();
	var move = game.move({
		from:source,
		to:target,
		promotion:'q'
	})
	if(move == null){
		return 'snapback';
	}
	window.setTimeout(takeNextMove, 500);
};

var onMouseoverSquare = function(square, piece) {
  var moves = game.moves({
    square: square,
    verbose: true
  });
  if (moves.length === 0) return;
  greySquare(square);

  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};
var onMouseoutSquare = function(square, piece) {
  removeGreySquares();
};

var onSnapEnd = function () {
    board.position(game.fen());
};

function undo(){
	if(undoFlag === 0){
		game.undo();
		game.undo();
		board.position(game.fen());		
	}
}

var cfg = {
    draggable: true,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoverSquare: onMouseoverSquare,
    onMouseoutSquare: onMouseoutSquare,
    onSnapEnd:onSnapEnd,
    position: 'start'

}
board = ChessBoard('board', cfg);

