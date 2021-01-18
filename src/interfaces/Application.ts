import { BaseClass } from './BaseClass';

interface ApplicationDefinition {
  controllers: BaseClass[];
  services?: BaseClass[];
  middleware?: BaseClass[];
  errorHandler?: BaseClass;
}

export type Application = new (...args: any[]) => ApplicationDefinition;