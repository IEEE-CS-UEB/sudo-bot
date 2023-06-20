class CSSValueParsingError extends Error {
  constructor(message) {
    super(message);
    this.name = "CSSValueParsingError";
  }
}

module.exports = { CSSValueParsingError }