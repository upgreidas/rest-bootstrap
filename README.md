# rest-bootstrap

Minimalistic TypeScript package for REST API project bootstrapping. Built on top of express.

## Installing
```sh
npm install rest-bootstrap
```

## Usage examples

### Controller class
```typescript
@Controller('/articles')
export class ArticleController {
  @Middleware(authMiddleware)
  @Get('/')
  getArticle(req: Request, res: Response) {
    res.send('get');
  }

  @Middleware(authMiddleware, postMiddleware)
  @Post('/')
  postArticle(req: Request, res: Response) {
    res.send('post');
  }
  
  @Put('/:id')
  putArticle(req: Request, res: Response) {
    res.send('put');
  }

  @Patch('/:id')
  patchArticle(req: Request, res: Response) {
    res.send('patch');
  }

  @Delete('/:id')
  deleteArticle(req: Request, res: Response) {
    res.send('delete');
  }
}
```

### Application class
```typescript
export class ExampleApplication {
  // Registered controllers
  controllers = [
    ArticleController,
    UserController,
  ];

  // Global middleware
  middleware = [
    helmet(),
    cors(),
  ];

  // Custom error handler
  errorHandler(err, req, res, next) {
    res.status(err.code || 500).send(err.message);
  }
};
```

### Starting a server
```typescript
import { serve } from 'rest-bootstrap';

import { ExampleApplication } from './app';

const port = process.env.PORT || 8000;

serve(ExampleApplication, port, () => {
  console.log(`Serving on ${port} port.`);
});
```