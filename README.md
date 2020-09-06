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

### Dependency injection
```typescript
@Service()
export class DatabaseService {
  create(table: string, data) {
  }

  delete(table: string, id: number) {
  }
};

@Service()
export class ArticleService {
  constructor(private database: DatabaseService) {
  }

  createArticle(data) {
    return this.database.create('articles', data);
  }

  deleteArticle(id: number) {
    return this.database.delete('articles', id);
  }
};

@Controller('/articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {
  }

  @Post('/')
  createArticle(req: Request, res: Response) {
    const article = this.articleService.createArticle(req.body);

    res.send(article);
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

  services = [
    DatabaseService,
    ArticleService,
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