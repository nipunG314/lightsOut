class Board {
    constructor(cellCount, width, height){
        this.cellCount = cellCount;
        this.width = width
        this.height = height
        let totalBoardLength = cellCount * 2 - 1;
        this.cellWidth = width / totalBoardLength;
        this.cellHeight = height / totalBoardLength;

        this.emptyColor = "#000000";
        this.fillColor = "#FF0000";

        this.board = new Array(cellCount)
        for(let i=0;i<cellCount;i++){
            this.board[i] = new Array(cellCount);
            this.board[i].fill(0);
        }
    }

    update(i, j) {
        this.board[i][j] = 1 - this.board[i][j];
    }

    updateAt(i, j){
        let updateList = [[i, j]]
        if(i > 0) {
            updateList.push([i-1, j]);
        }
        if(i < (this.cellCount-1)) {
            updateList.push([i+1, j]);
        }
        if(j > 0) {
            updateList.push([i, j-1]);
        }
        if(j < (this.cellCount-1)) {
            updateList.push([i, j+1]);
        }
        updateList.forEach( pair => {
            this.update(pair[0], pair[1]);
        })
    }

    draw(context){
        for(let i=0; i< this.cellCount*1.5; i += 1.5){
            for(let j=0; j<this.cellCount*1.5; j += 1.5){
                if(this.board[i/1.5][j/1.5] == 0){
                    context.fillStyle = "#000000";
                }
                else {
                    context.fillStyle = "#FF0000";
                }
                context.fillRect(j*this.cellWidth, i*this.cellHeight, this.cellWidth, this.cellHeight);
            }
        }
    }
} 

let canvas = document.querySelector(".board");
let context = canvas.getContext("2d");
let board = new Board(5, 400, 400);
canvas.width = 400;
canvas.height = 400;

board.draw(context);