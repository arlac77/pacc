/**
 * Split property path into tokens
 * @generator
 * @param {string} string
 * @yields {string}
 */
export function* tokens(string) {
  let state, buffer;

  for (const c of string) {
    switch (state) {
      case "string-escaping":
        const esc = {
          "\\": "\\",
          b: "\b",
          f: "\f",
          n: "\n",
          r: "\r",
          t: "\t"
        };
        buffer += esc[c];
        state = "string";
        continue;
    }

    switch (c) {
      case "\t":
      case " ":
        switch (state) {
          case undefined:
            break;
          case "string":
            buffer += c;
            break;
          case "identifier":
            yield buffer;
            buffer = "";
            state = undefined;
            break;
          default:
            yield state;
            state = undefined;
        }
        break;

      case "\\":
        switch (state) {
          case "string":
            state = "string-escaping";
            break;
        }
        break;
      case '"':
      case "'":
        switch (state) {
          case undefined:
            buffer = "";
            state = "string";
            break;
          case "string":
            yield buffer;
            state = undefined;
            break;
          case "identifier":
            yield buffer;
            buffer = "";
            state = "string";
            break;
          default:
            yield state;
            buffer = "";
            state = "string";
        }
        break;
      case "!":
      case ">":
      case "<":
      case "&":
      case "|":
        switch (state) {
          case "&":
          case "|":
            if (state === c) {
              yield state + c;
              state = undefined;
            } else {
              yield state;
              state = c;
            }
            break;
          case undefined:
            state = c;
            break;
          case "string":
            buffer += c;
            break;
          case "identifier":
            yield buffer;
            state = c;
            break;
          default:
            yield state;
            state = c;
        }
        break;

      case "=":
        switch (state) {
          case undefined:
            state = c;
            break;
          case "string":
            buffer += c;
            break;
          case "identifier":
            yield buffer;
            state = c;
            break;
          default:
            state += c;
        }
        break;
      case ":":
      case ";":
      case ",":
      case ".":
      case "+":
      case "-":
      case "*":
      case "/":
      case "(":
      case ")":
      case "[":
      case "]":
      case "{":
      case "}":
        switch (state) {
          case undefined:
            state = c;
            break;
          case "string":
            buffer += c;
            break;
          case "identifier":
            yield buffer;
            state = c;
            break;
          default:
            yield state;
            state = c;
        }
        break;
      default:
        switch (state) {
          case undefined:
            buffer = c;
            state = "identifier";
            break;
          case "string":
          case "identifier":
            buffer += c;
            break;
          default:
            if (
              (c >= "a" && c <= "z") ||
              (c >= "A" && c <= "Z") ||
              (c >= "0" && c <= "9") ||
              c === "_"
            ) {
              yield state;
              state = "identifier";
              buffer = c;
            } else {
              state += c;
            }
        }
    }
  }

  switch (state) {
    case undefined:
      break;
    case "string":
      throw new Error("unterminated string");
    case "identifier":
      yield buffer;
      break;
    default:
      yield state;
  }
}
