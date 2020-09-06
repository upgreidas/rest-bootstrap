import { BaseClass } from './interfaces/BaseClass';

export class Injector extends Map {
  public resolve(target: BaseClass) {
      const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
      const injections = tokens.map((token: BaseClass) => this.resolve(token));

      const classInstance = this.get(target);
      if (classInstance) {
          return classInstance;
      }

      const newClassInstance = new target(...injections);
      this.set(target, newClassInstance);

      return newClassInstance;
  }
}