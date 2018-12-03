class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    run(cellCount){
        this.board = new Board(cellCount, this.width, this.height);
        this.canvas = document.querySelector(".board");
        this.context = this.canvas.getContext("2d");

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.board.draw(this.context);

        this.canvas.addEventListener('click', (event) => {
            let {success, i, j} = this.board.getIndex(this.canvas, event);
            if(success) {
                this.board.updateAt(i, j);
                this.board.draw(this.context);
            }
        })
    }
}

class Board {
    constructor(cellCount, width, height){
        this.cellCount = cellCount;
        this.width = width
        this.height = height
        let totalBoardLength = (cellCount * 3 - 1)/2; // Total number of cells needed in both directions. It treats each gap as a half cell.
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
        // The increment is done by 1.5 so that it leaves space for the negative space between the lights.
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

    getIndex(canvas, event){
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        let shiftWidth = (3*this.cellWidth)/2;
        let shiftHeight = (3*this.cellHeight)/2;

        let j = parseInt(x/shiftWidth);
        let i = parseInt(y/shiftHeight);

        if(parseInt(x/shiftWidth + 1/3) > j){
            return {success: false, i: 0, j: 0}
        }
        if(parseInt(y/shiftWidth + 1/3) > i){
            return {success: false, i: 0, j: 0}
        }
        return {success: true, i: i, j: j}
    }
} 

let game = new Game(400, 400);

game.run(3);