import { HttpError } from './HttpError';

export class ValidationError extends HttpError {
  constructor(errors: any[], message = 'Unprocessable Entity') {
    super(422, message, errors);
  }
}