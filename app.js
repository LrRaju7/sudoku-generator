const SudokuUtil = {
  isValidPuzzle: (grid) => {
    for (let i = 0; i < grid.length; i++) {
      if (!isValidRow(grid, i)) {
        return false;
      }
      if (!isValidCol(grid, i)) {
        return false;
      }
    }
    if (!isValidBox(grid)) {
      return false;
    }
    return true;
  },

  isValidPlace: (grid, row, column, number) => {
    for (let i = 0; i < 9; i++) {
      if (grid[i][column] === number) {
        return false;
      }
    }
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === number) {
        return false;
      }
    }
    let localBoxRow = row - (row % 3);
    let localBoxCol = column - (column % 3);
    for (let i = localBoxRow; i < localBoxRow + 3; i++) {
      for (let j = localBoxCol; j < localBoxCol + 3; j++) {
        if (grid[i][j] === number) {
          return false;
        }
      }
    }
    return true;
  },
};
  
const isValidRow = (grid, row) => {
  let set = new Set();
  for (let i = 0; i < 9; i++) {
    let number = grid[row][i];
    if (number < 0 || number > 9) {
      return false;
    }
    if (set.has(number)) {
      return false;
    } else {
      number !== 0 && set.add(number);
    }
  }
  return true;
}
  
const isValidCol = (grid, col) => {
  let set = new Set();
  for (let i = 0; i < 9; i++) {
    let number = grid[i][col];
    if (number < 0 || number > 9) {
      return false;
    }
    if (set.has(number)) {
      return false;
    } else {
      number !== 0 && set.add(number);
    }
  }
  return true;
}
  
const isValidBox = (grid) => {
  for (let row = 0; row < grid.length; row += 3) {
    for (let column = 0; column < grid.length; column += 3) {
      let set = new Set();
      for (let subRow = 0; subRow < 3; subRow++) {
        for (let subCol = 0; subCol < 3; subCol++) {
          let number = grid[subRow][subCol];
          if (number < 0 || number > 9) {
            return false;
          }
          if (set.has(number)) {
            return false;
          } else {
            number !== 0 && set.add(number);
          }
        }
      }
    }
  }
  return true;
}

const solve = (grid) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let possibleNumber = 1; possibleNumber <= 9; possibleNumber++) {
          if (SudokuUtil.isValidPlace(grid, row, col, possibleNumber)) {
            grid[row][col] = possibleNumber;
            if (solve(grid)) {
              return true;
            }
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }    
  }
  return true;
}


const getRandomSudoku = () => {
    const randomSudoku = [];
    for (let i = 0; i < 9; i++) {
      randomSudoku[i] = Array(9).fill(0);
    }
    for (let i = 0; i < 8; i++) {
      let number = Math.floor(Math.random() * 8) + 1;
      while (!SudokuUtil.isValidPlace(randomSudoku, 0, i, number)) {
        number = Math.floor(Math.random() * 8) + 1;
      }
      if (SudokuUtil.isValidPlace(randomSudoku, 0, i, number)) {
        randomSudoku[0][i] = number;
      }
    }
    return randomSudoku;
}

const solveThePuzzle = (puzzle) => {
  let solved = [];
  for (var i = 0; i < 9; i++){
    var row = [];
    for (var j = 0; j < 9; j++){
      row.push(puzzle[i][j]);
    }
    solved[i] = row
  }
  return solved;
}

const puzzleView = (allPuzzle) => {
  let parent = document.getElementById("generated-puzzles");
  parent.innerHTML='';
  allPuzzle.forEach((puzzle, index)=>{
    let mainDiv = document.createElement("div")
    mainDiv.classList.add('col-4')
    mainDiv.classList.add('py-2')
    let puzzleNumber = document.createElement('p')
    let textnode = document.createTextNode(`Puzzle No: ${index+1}`);
    puzzleNumber.appendChild(textnode);
    mainDiv.appendChild(puzzleNumber);
    let item;
    for(let i = 0; i< puzzle.length; i++){
      for(let j = 0; j< puzzle.length; j++){
        if(puzzle[i][j] === 0){
          item = document.createElement("input")
          item.setAttribute("id", `${i+1}-${j+1}`)
          item.setAttribute("class", "generated-puzzles")
          item.setAttribute("type", "text")
          item.setAttribute("value", "")
        }else{
          item = document.createElement("input")
          item.setAttribute("id", `${i+1}-${j+1}`)
          item.setAttribute("class", "generated-puzzles ")
          item.setAttribute("type", "text")
          item.setAttribute("value", `${puzzle[i][j]}`)
        }
        mainDiv.appendChild(item);
      }
      let node = document.createElement("br")
      mainDiv.appendChild(node)
    }
    document.getElementById("generated-puzzles").appendChild(mainDiv)
  })
}

const resultView = (allSolution) => {
  let parent = document.getElementById("puzzle-result");
  parent.innerHTML='';
  allSolution.forEach((puzzle, index)=>{
    let mainDiv = document.createElement("div")
    mainDiv.classList.add('col-3')
    mainDiv.classList.add('py-2')
    let puzzleNumber = document.createElement('p')
    let textnode = document.createTextNode(`Puzzle No: ${index+1}`);
    puzzleNumber.appendChild(textnode);
    mainDiv.appendChild(puzzleNumber);
    let item;
    for(let i = 0; i< puzzle.length; i++){
      for(let j = 0; j< puzzle.length; j++){
        item = document.createElement("input")
        item.setAttribute("id", `${i+1}-${j+1}`)
        item.setAttribute("type", "text")
        item.setAttribute("readonly", "true")
        item.setAttribute("class", "puzzle-result")
        item.setAttribute("value", `${puzzle[i][j]}`)
        mainDiv.appendChild(item);
      }
      let node = document.createElement("br")
      mainDiv.appendChild(node)
    }
    document.getElementById("puzzle-result").appendChild(mainDiv)
  })
}

const createPuzzle = () => {
    let numberOfPuzzles = parseInt(document.getElementById('total-puzzle').value);
    let allPuzzle = [];
    let allSolution = [];
    for(let r=1; r<=numberOfPuzzles; r++){
      let puzzle = getRandomSudoku();
      let solution = solve(puzzle);
      if (solution) {
        let solvedPuzzle = solveThePuzzle(puzzle);
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
              if (Math.random() > 0.3) puzzle[i][j] = 0;
          }
        }
        allPuzzle.push(puzzle)
        allSolution.push(solvedPuzzle);
      }
    }
    puzzleView(allPuzzle);
    resultView(allSolution);
}

const downloadPDF = () => {
  let sudokuPuzzles = document.getElementById("main")
  let sudokuResult = document.getElementById("solved")
  var optPuzzle = {
    margin:       [0,0,0,0],
    filename:     'sudoku.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 1 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  var optResult = {
    margin:       [0,0,0,0],
    filename:     'sudoku-result.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 1 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().from(sudokuPuzzles).set(optPuzzle).save()
  html2pdf().from(sudokuResult).set(optResult).save()
}