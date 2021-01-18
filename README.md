# rest-bootstrap

Minimalistic TypeScript package for REST API project bootstrapping. Built on top of express.

## Installing

```sh
npm install rest-bootstrap
```

## Usage examples

### Controller class

```typescript
import {
  Controller,
  Middleware,
  Get,
  Post,
  Put,
  Patch,
  Delete,
} from "rest-bootstrap";

@Controller("/articles")
export class ArticleController {
  @Middleware(AuthMiddleware)
  @Get("/")
  getArticle() {
    return "get";
  }

  @Middleware(AuthMiddleware, PostMiddleware)
  @Post("/")
  postArticle() {
    return "post";
  }

  @Put("/:id")
  putArticle() {
    return "put";
  }

  @Patch("/:id")
  patchArticle() {
    return "patch";
  }

  @Delete("/:id")
  deleteArticle() {
    return "delete";
  }
}
```

### Request parameters

You can access request parameters such as query, body, headers and route parameters using decorators.

```typescript
@Get("/")
search(@Query('s') searchQuery) {
  //
}
```

```typescript
@Post("/")
store(@Body() data) {
  //
}
```

```typescript
@Put("/:id")
update(@Param('id') id, @Body('price') price) {
  //
}
```

```typescript
@Get("/auth")
auth(@Header('Authorization') token) {
  //
}
```

### Middleware class

```typescript
import { Request, Response } from "express";

export class AuthMiddleware {
  handle(request: Request, response: Response, next) {
    if (!request.headers.authorization) {
      return res.status(401).send("Go away!");
    }

    next();
  }
}
```

### Dependency injection

```typescript
@Service()
export class DatabaseService {
  create(table: string, data) {}

  delete(table: string, id: number) {}
}

@Service()
export class ArticleService {
  constructor(private database: DatabaseService) {}

  createArticle(data) {
    return this.database.create("articles", data);
  }

  deleteArticle(id: number) {
    return this.database.delete("articles", id);
  }
}

@Injectable()
export class AuthMiddleware {
  constructor(private database: DatabaseService) {}

  handle(request: Request, response: Response, next) {}
}

@Controller("/articles")
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Post("/")
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
  controllers = [ArticleController, UserController];

  // Global middleware
  middleware = [AuthMiddleware, LogMiddleware];

  // Registered services
  services = [DatabaseService, ArticleService];

  // Custom error handler
  errorHandler = CustomErrorHandler;
}
```

### Starting a server

```typescript
import { serve } from "rest-bootstrap";

import { ExampleApplication } from "./app";

const port = process.env.PORT || 8000;

serve(ExampleApplication, port, () => {
  console.log(`Serving on ${port} port.`);
});
```
