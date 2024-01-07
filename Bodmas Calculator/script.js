class Calculator {
  constructor() {
    this.result = 0;
  }
  add(num) {
    this.result += parseFloat(num);
  }
  subtract(num) {
    this.result -= parseFloat(num);
  }
  multiply(num) {
    this.result *= parseFloat(num);
  }
  divide(num) {
    if (num !== 0) this.result /= parseFloat(num);
    else throw Error("Invalid", "Invalid");
  }
  clear() {
    this.result = 0;
  }
  getResult() {
    return this.result;
  }
  calculate(expression) {
    expression = expression.replaceAll(" ", "");
    var regExp = /[a-zA-Z]/g;

    if (regExp.test(expression)) {
      throw Error("Invalid", "Invalid");
    } else if (!this.validParanthesis(expression)) {
      throw Error("Invalid", "Invalid");
    } else {
      this.result = this.evaluateExpressionWithBracket(expression);
    }
  }
  evaluateExpressionWithBracket(expression) {
    const lastStartIndex = expression.lastIndexOf("(");
    if (lastStartIndex > -1) {
      const firstEndIndex =
        expression.substring(lastStartIndex).indexOf(")") + lastStartIndex;
      if (firstEndIndex > -1) {
        const res = this.evaluateSimpleExpression(
          expression.substring(lastStartIndex + 1, firstEndIndex)
        );
        expression =
          expression.substring(0, lastStartIndex) +
          res +
          expression.substring(firstEndIndex + 1);
        return this.evaluateExpressionWithBracket(expression);
      }
    } else {
      return this.evaluateSimpleExpression(expression);
    }
  }
  evaluateSimpleExpression(expression) {
    const operators = "+-*/";
    let numIsNegative = 1;
    let isDecimal = 1;
    const numberStack = [];
    const operatorStack = [];

    for (let i = 0; i < expression.length; i++) {
      if (operators.indexOf(expression[i]) > -1) {
        switch (expression[i]) {
          case "+":
            if (operatorStack.length > 0) {
              numberStack.push(
                this.evaluateOperation(
                  operatorStack.pop(),
                  parseFloat(numberStack.pop()),
                  parseFloat(numberStack.pop())
                )
              );
            }
            operatorStack.push(expression[i]);
            break;
          case "-":
            if (i === 0) numIsNegative = -1; // If first operand is negative, skip this - operator
            if (numIsNegative === 1) {
              if (operatorStack.length > 0) {
                numberStack.push(
                  this.evaluateOperation(
                    operatorStack.pop(),
                    parseFloat(numberStack.pop()),
                    parseFloat(numberStack.pop())
                  )
                );
              }
              operatorStack.push(expression[i]);
            }
            break;
          case "*":
          case "/":
            // * and / needs to be addressed before + and  - so push it on  top of the stack and keep resolving it as soon as next + or - is encountered
            operatorStack.push(expression[i]);
            break;
        }
        if (numIsNegative == 1 && expression[i + 1] === "-") numIsNegative = -1; // If upcoming operator after this operator is - so the next operand will be negative
        isDecimal = 1;
      } else {
        // If this is a decimal then skip it and the next digit that comes will be divided by 10
        if (expression[i] === ".") {
          isDecimal = 10;
        } else {
          const num = parseFloat(expression[i]);
          // This is the first digit of the first +ve or -ve operand in the number stack || this is the first digit of a +ve operand after an operator || this is the first digit of a -ve operand after an operator
          if (
            numberStack.length === 0 ||
            (numIsNegative == 1 && operators.indexOf(expression[i - 1]) > -1) ||
            (numIsNegative == -1 && operators.indexOf(expression[i - 2]) > -1)
          ) {
            numberStack.push((num * numIsNegative) / isDecimal);
          }
          // These are the other digits of the operands that go into number stack
          else {
            if (isDecimal !== 1)
              numberStack.push(
                (numberStack.pop() * isDecimal + num) / isDecimal
              );
            else numberStack.push(numberStack.pop() * 10 + num);
          }
          numIsNegative = 1;
          if (isDecimal !== 1) isDecimal *= 10;
        }
      }
    }

    if (operatorStack.length !== 0) {
      while (operatorStack.length > 0) {
        numberStack.push(
          this.evaluateOperation(
            operatorStack.pop(),
            parseFloat(numberStack.pop()),
            parseFloat(numberStack.pop())
          )
        );
      }
    }
    return numberStack.pop();
  }
  evaluateOperation(operator, operand1, operand2) {
    this.result = operand2;
    switch (operator) {
      case "+":
        this.add(operand1);
        break;
      case "-":
        this.subtract(operand1);
        break;
      case "*":
        this.multiply(operand1);
        break;
      case "/":
        this.divide(operand1);
        break;
    }
    return this.result;
  }
  validParanthesis(expression) {
    let brackets = [];
    for (const c of expression) {
      if (c === "(") brackets.push(c);
      else if (c === ")") {
        if (brackets.length === 0) return false;
        else brackets.pop();
      }
    }
    if (brackets.length > 0) return false;
    else return true;
  }
}

const submitBtn = document.querySelector(".btn.evaluate");
const input = document.querySelector(".input");
const result = document.getElementById("result");
const resetBtn = document.querySelector(".btn.reset");

submitBtn.addEventListener("click", function () {
  const obj = new Calculator();
  obj.calculate(input.value);
  result.textContent = result.textContent.replaceAll("$value", obj.result);
  result.style.visibility = "visible";
  obj.result = 0;
});

resetBtn.addEventListener("click", function () {
  input.value = "";
  result.style.visibility = "hidden";
});
