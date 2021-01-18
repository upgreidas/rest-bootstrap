import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Application } from './interfaces/Application';
import { RouteOptions } from './interfaces/RouteOptions';
import { HttpError } from './errors/HttpError';
import { Injector } from './Injector';
import { ParamOptions } from './interfaces/ParamOptions';
import { MiddlewareInterface } from './interfaces/MiddlewareInterface';
import { BaseClass } from './interfaces/BaseClass';

export * from './Decorators';
export * from './errors/BadRequestError';
export * from './errors/ForbiddenError';
export * from './errors/HttpError';
export * from './errors/InternalServerError';
export * from './errors/NotFoundError';
export * from './errors/UnauthorizedError';
export * from './errors/ValidationError';

const defaultMiddleware = [
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
];

const defaultErrorHandler = (err: HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.code || 500).send(err);
};

export const serve = (application: Application, port: number, callback?: () => void) => {
  const app = express();

  const applicationInstance = new application();
  const injector = new Injector();

  if(applicationInstance.services) {
    applicationInstance.services.forEach(async (service) => {
      const serviceInstance = injector.resolve(service);

      if(typeof serviceInstance.init === 'function') {
        await serviceInstance.init();
      }
    });
  }

  // Register global middleware
  const globalMiddleware = [...defaultMiddleware];

  if(applicationInstance.middleware) {
    applicationInstance.middleware.forEach(middleware => {
      const middlewareInstance = injector.resolve(middleware) as MiddlewareInterface;

      globalMiddleware.push(middlewareInstance.handle.bind(middlewareInstance));
    });
  }

  globalMiddleware.forEach(middleware => {
    app.use(middleware);
  });

  // Register controllers
  applicationInstance.controllers.forEach(controller => {
    const controllerInstance = injector.resolve(controller);
    const router = express.Router();
    const prefix = Reflect.getMetadata('prefix', controller) || '';
    const routes = Reflect.getMetadata('routes', controller) as RouteOptions[] || [];

    routes.forEach(route => {
      if(!route.requestMethod || !route.path || !route.handler) {
        return;
      }

      const routeMiddleware: any[] = [];

      // Register route middleware
      if(route.middleware) {
        route.middleware.forEach(middleware => {
          const middlewareInstance = injector.resolve(middleware) as MiddlewareInterface;

          const asyncHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            try {
              await middlewareInstance.handle(req, res, next);
            } catch(e) {
              next(e);
            }
          };

          routeMiddleware.push(asyncHandler);
        });
      }

      const params = Reflect.getMetadata('params', controllerInstance, route.handler) as ParamOptions[] || [];

      // Register route handler
      router[route.requestMethod](route.path, routeMiddleware, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const extractedParams = params.map((param) => {
          if(param.type === 'request') {
            return req;
          } else if(param.type === 'response') {
            return res;
          } else if(param.type === 'body') {
            if(param.name) {
              return req.body[param.name];
            } else {
              return req.body;
            }
          } else if(param.type === 'query') {
            if(param.name) {
              return req.query[param.name];
            } else {
              return req.query;
            }
          } else if(param.type === 'header') {
            if(param.name) {
              return req.headers[param.name];
            } else {
              return req.headers;
            }
          }
        });

        try {
          const results = await controllerInstance[String(route.handler)](...extractedParams);

          res.send(results);
        } catch(e) {
          next(e);
        }
      });
    });

    app.use(prefix, router);
  });

  let errorHandler = defaultErrorHandler;

  if(applicationInstance.errorHandler) {
    const errorHandlerInstance = injector.resolve(applicationInstance.errorHandler);

    errorHandler = errorHandlerInstance.handle.bind(errorHandlerInstance);
  }

  app.use(errorHandler);

  return app.listen(port, callback);
};