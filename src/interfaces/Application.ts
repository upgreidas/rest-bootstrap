import { ControllerConstructor } from './ControllerConstructor';
import { MiddlewareFunction } from './MiddlewareFunction';

interface ApplicationDefinition {
  controllers: ControllerConstructor[];
  middleware?: MiddlewareFunction[];
  errorHandler?: MiddlewareFunction;
}

export type Application = new (...args: any[]) => ApplicationDefinition;