import { RequestMethod } from '../enums/RequestMethod';
import { MiddlewareFunction } from './MiddlewareFunction';

export interface RouteOptions {
  requestMethod?: RequestMethod;
  path?: string;
  handler?: string;
  middleware?: MiddlewareFunction[];
}