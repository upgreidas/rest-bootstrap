import { Response } from '../src/interfaces/Response';
import { Request } from '../src/interfaces/Request';
import { Controller, Get, Post, Put, Patch, Delete, Options } from '../src/decorators';

@Controller('/articles')
export class ExampleController {

  @Get('/')
  getArticle(req: Request, res: Response) {
    res.send('get');
  }

  @Post('/')
  postArticle(req: Request, res: Response) {
    res.send('post');
  }

  @Put('/')
  putArticle(req: Request, res: Response) {
    res.send('put');
  }

  @Patch('/')
  patchArticle(req: Request, res: Response) {
    res.send('patch');
  }

  @Delete('/')
  deleteArticle(req: Request, res: Response) {
    res.send('delete');
  }

  @Options('/')
  articleOptions(req: Request, res: Response) {
    res.send('options');
  }

}