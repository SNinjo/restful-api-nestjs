# restful-api-nestjs &middot; ![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen)

A RESTful API server includes

* Framework: Nest.js
* OpenAPI: Swagger
* Database: MongoDB
* ORM: Mongoose
* Test: Jest.js
* Environment: Docker
* Deployment: Docker Compose

## Usage

### Build Database

```shell
docker-compose up -d mongo mongo-express
```

[Mongo Express](http://localhost:8081)

* username: root
* password: pass

### Develop

```shell
npm run start:dev
```

[Swagger](http://localhost:3000/docs)

### Test

```shell
npm run test:cov
```

### Deploy

```shell
docker build . -t restful-api-nestjs
docker-compose up -d
```
