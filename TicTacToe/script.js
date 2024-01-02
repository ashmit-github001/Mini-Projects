const buttons = document.querySelectorAll(".btn");
const resetButton = document.querySelector("#reset");
const winnerDisplay = document.querySelector("#winner");

let turn = 0;
let winner = "";
let gameOver = false;
const winningPatterns = [
  [1, 2, 3],
  [1, 4, 7],
  [1, 5, 9],
  [2, 5, 8],
  [3, 5, 7],
  [4, 5, 6],
  [7, 8, 9],
];

const checkWinner = function () {
  let moves = "";
  buttons.forEach((e) => (moves += e.textContent ? e.textContent : " "));
  console.log(moves);
  for (const [first, second, third] of winningPatterns) {
    if (
      moves[first - 1] === "X" &&
      moves[second - 1] === "X" &&
      moves[third - 1] === "X"
    ) {
      winner = "Player 1";
      return true;
    } else if (
      moves[first - 1] === "O" &&
      moves[second - 1] === "O" &&
      moves[third - 1] === "O"
    ) {
      winner = "Player 2";
      return true;
    }
  }
  return false;
};

const PutSymbol = function () {
  this.textContent = turn === 0 ? "X" : "O";
  turn = turn ? 0 : 1;
  this.disabled = true;
  if (checkWinner()) {
    buttons.forEach((e) => (e.disabled = true));
    winnerDisplay.textContent = `Congratulations! ${winner} won!`;
    document.body.style.backgroundColor = "yellowgreen";
  }
};

const ResetGame = function () {
  buttons.forEach((e) => ((e.disabled = false), (e.textContent = "")));
  document.body.style.backgroundColor = "black";
  winnerDisplay.textContent = "";
  winner = "";
  turn = 0;
};

buttons.forEach((e) => e.addEventListener("click", PutSymbol));
resetButton.addEventListener("click", ResetGame);
