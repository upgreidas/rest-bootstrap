import { RequestMethod } from '../enums/RequestMethod';
import { MiddlewareFunction } from './MiddlewareFunction';
import { ParamOptions } from './ParamOptions';

export interface RouteOptions {
  requestMethod?: RequestMethod;
  path?: string;
  handler?: string;
  middleware?: MiddlewareFunction[];
}