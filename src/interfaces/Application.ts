import { BaseClass } from './BaseClass';
import { MiddlewareFunction } from './MiddlewareFunction';

interface ApplicationDefinition {
  controllers: BaseClass[];
  services?: BaseClass[];
  middleware?: MiddlewareFunction[];
  errorHandler?: MiddlewareFunction;
}

export type Application = new (...args: any[]) => ApplicationDefinition;