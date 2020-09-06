import 'reflect-metadata';

import { RequestMethod } from './enums/RequestMethod';
import { RouteOptions } from './interfaces/RouteOptions';
import { MiddlewareFunction } from './interfaces/MiddlewareFunction';
import { BaseClass } from './interfaces/BaseClass';

const addRoute = (target: any, property: string, requestMethod: RequestMethod, path: string): void => {
  let routes = Reflect.getMetadata('routes', target.constructor) as RouteOptions[];

  if(!routes) {
    routes = [];
  }

  const existingRoute = routes.find(route => route.handler === property);

  if(existingRoute) {
    existingRoute.requestMethod = requestMethod;
    existingRoute.path = path;
    existingRoute.handler = property;
  } else {
    routes.push({
      requestMethod,
      path,
      handler: property,
      middleware: [],
    });
  }

  Reflect.defineMetadata('routes', routes, target.constructor);
};

const addMiddleware = (target: any, property: string, ...middleware: MiddlewareFunction[]): void => {
  let routes = Reflect.getMetadata('routes', target.constructor) as RouteOptions[];

  if(!routes) {
    routes = [];
  }

  const existingRoute = routes.find(route => route.handler === property);

  if(existingRoute) {
    if(!existingRoute.middleware) {
      existingRoute.middleware = [];
    }

    existingRoute.middleware.push(...middleware);
  } else {
    routes.push({
      handler: property,
      middleware,
    });
  }

  Reflect.defineMetadata('routes', routes, target.constructor);
};

export const Service = (): (target: BaseClass) => void => {
  return (target: BaseClass) => {
    //
  };
};

export const Middleware = (...middleware: MiddlewareFunction[]): MethodDecorator => {
  return (target: any, property: string): void => {
    addMiddleware(target, property, ...middleware);
  };
};

export const Controller = (prefix: string = ''): (target: BaseClass) => void => {
  return (target: BaseClass) => {
    Reflect.defineMetadata('prefix', prefix, target);
  };
};

export const Get = (path: string): MethodDecorator => {
  return (target: any, property: string): void => {
    addRoute(target, property, RequestMethod.Get, path);
  };
};

export const Post = (path: string): MethodDecorator => {
  return (target: any, property: string): void => {
    addRoute(target, property, RequestMethod.Post, path);
  };
};

export const Put = (path: string): MethodDecorator => {
  return (target: any, property: string): void => {
    addRoute(target, property, RequestMethod.Put, path);
  };
};

export const Patch = (path: string): MethodDecorator => {
  return (target: any, property: string): void => {
    addRoute(target, property, RequestMethod.Patch, path);
  };
};

export const Delete = (path: string): MethodDecorator => {
  return (target: any, property: string): void => {
    addRoute(target, property, RequestMethod.Delete, path);
  };
};

export const Options = (path: string): MethodDecorator => {
  return (target: any, property: string): void => {
    addRoute(target, property, RequestMethod.Options, path);
  };
};