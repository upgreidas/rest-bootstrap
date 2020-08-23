export class HttpError extends Error {
  private _code: number;

  private _errors: any[] = [];

  constructor(code: number, message: string, errors: any[] = []) {
    super(message);

    this._code = code;
    this._errors = errors;
  }

  get code() {
    return this._code;
  }

  get errors() {
    return [...this._errors];
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      errors: this.errors,
    };
  }
}