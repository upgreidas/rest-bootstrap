import { RequestMethod } from '../enums/RequestMethod';
import { BaseClass } from './BaseClass';

export interface RouteOptions {
  requestMethod?: RequestMethod;
  path?: string;
  handler?: string;
  middleware?: BaseClass[];
}