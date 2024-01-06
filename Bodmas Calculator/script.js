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
      return this.evaluateExpressionWithBracket(expression);
    }
  }
  evaluateExpressionWithBracket(expression) {
    this.clear();
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
    let isDecimal = false;
    const numberStack = [];
    const operatorStack = [];

    for (let i = 0; i < expression.length; i++) {
      if (operators.indexOf(expression[i]) > -1) {
        if (expression[i + 1] === "-") numIsNegative = -1;
        switch (expression[i]) {
          case "+":
            if (operatorStack.length > 1) {
              numberStack.push(
                this.evaluateMidOperation(
                  operatorStack.pop(),
                  parseFloat(numberStack.pop()),
                  parseFloat(numberStack.pop())
                )
              );
            } else if (operatorStack.length > 0) {
              this.evaluateLastOperation(
                operatorStack.pop(),
                numberStack.pop()
              );
            }
            operatorStack.push(expression[i]);
            break;
          case "-":
            if (i === 0) numIsNegative = -1;
            if (numIsNegative === 1) {
              if (operatorStack.length > 1) {
                numberStack.push(
                  this.evaluateMidOperation(
                    operatorStack.pop(),
                    parseFloat(numberStack.pop()),
                    parseFloat(numberStack.pop())
                  )
                );
              } else if (operatorStack.length > 0) {
                this.evaluateLastOperation(
                  operatorStack.pop(),
                  numberStack.pop()
                );
              }
              operatorStack.push(expression[i]);
            }
            break;
          case "*":
          case "/":
            operatorStack.push(expression[i]);
            break;
        }
      } else {
        if (expression[i] === ".") {
          isDecimal = true;
        } else {
          const num = parseFloat(expression[i]);
          // This is the first operand of expression so store in  result
          if (numberStack.length === 0 && operatorStack.length === 0) {
            if (isDecimal)
              this.result = this.result + (num / 10) * numIsNegative;
            else this.result = this.result * 10 + num * numIsNegative;
          }
          // These are the later operands
          else {
            // This is the first digit of the operand after an operator and in  the number stack
            if (
              numberStack.length === 0 ||
              operators.indexOf(expression[i - 1]) > -1
            ) {
              if (isDecimal) numberStack.push((num / 10) * numIsNegative);
              else numberStack.push(num * numIsNegative);
            }
            // These are the other digits of the operands that go into number stack
            else {
              if (isDecimal) numberStack.push(numberStack.pop() + num / 10);
              else numberStack.push(numberStack.pop() * 10 + num);
            }
          }
          numIsNegative = 1;
          isDecimal = false;
        }
      }
    }

    if (operatorStack.length === 0 && numberStack.length === 0)
      return this.result;
    else {
      while (operatorStack.length > 0) {
        if (operatorStack.length > 1) {
          numberStack.push(
            this.evaluateMidOperation(
              operatorStack.pop(),
              parseFloat(numberStack.pop()),
              parseFloat(numberStack.pop())
            )
          );
        } else {
          this.evaluateLastOperation(operatorStack.pop(), numberStack.pop());
        }
      }
      return this.result;
    }
  }
  evaluateLastOperation(operator, operand) {
    switch (operator) {
      case "+":
        this.add(operand);
        break;
      case "-":
        this.subtract(operand);
        break;
      case "*":
        this.multiply(operand);
        break;
      case "/":
        this.divide(operand);
        break;
    }
  }
  evaluateMidOperation(operator, operand1, operand2) {
    switch (operator) {
      case "+":
        return operand1 + operand2;
      case "-":
        return (operand1 - operand2) * -1;
      case "*":
        return operand1 * operand2;
      case "/":
        return 1 / (operand1 / operand2);
    }
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
