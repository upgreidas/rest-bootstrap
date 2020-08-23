import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Request } from './interfaces/Request';
import { Response } from './interfaces/Response';
import { Application } from './interfaces/Application';
import { RouteOptions } from './interfaces/RouteOptions';
import { MiddlewareFunction } from './interfaces/MiddlewareFunction';
import { HttpError } from './errors/HttpError';

export * from './decorators';
export * from './interfaces/Request';
export * from './interfaces/Response';
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

const defaultErrorHandler = (err: HttpError, req: Request, res: Response, next: express.NextFunction) => {
  res.status(err.code || 500).send(err);
};

export const serve = (application: Application, port: number, callback?: () => void) => {
  const app = express();

  const applicationInstance = new application();

  // Register global middleware
  const globalMiddleware = [...defaultMiddleware];

  if(applicationInstance.middleware) {
    globalMiddleware.push(...applicationInstance.middleware);
  }

  globalMiddleware.forEach(middleware => {
    app.use(middleware);
  });

  // Register controllers
  applicationInstance.controllers.forEach(controller => {
    const controllerInstance = new controller();
    const router = express.Router();
    const prefix = Reflect.getMetadata('prefix', controller) || '';
    const routes = Reflect.getMetadata('routes', controller) as RouteOptions[];

    routes.forEach(route => {
      if(!route.requestMethod || !route.path || !route.handler) {
        return;
      }

      const routeMiddleware: MiddlewareFunction[] = [];

      // Register route middleware
      if(route.middleware) {
        route.middleware.forEach(middleware => {
          const asyncHandler = async (req: Request, res: Response, next: express.NextFunction) => {
            try {
              await middleware(req, res, next);
            } catch(e) {
              next(e);
            }
          };

          routeMiddleware.push(asyncHandler);
        });
      }

      // Register route handler
      router[route.requestMethod](route.path, routeMiddleware, async (req: Request, res: Response, next: express.NextFunction) => {
        try {
          await controllerInstance[String(route.handler)](req, res);
        } catch(e) {
          next(e);
        }
      });
    });

    app.use(prefix, router);
  });

  app.use(applicationInstance.errorHandler || defaultErrorHandler);

  return app.listen(port, callback);
};