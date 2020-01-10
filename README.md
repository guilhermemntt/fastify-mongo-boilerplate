# fastify-mongo-boilerplate

Deploy a Node.js server very quickly with Fastify and MongoDB.

## File structure

- :file_folder: dist/
- :file_folder: node_modules/
- :open_file_folder: src/
  - :file_folder: controllers/
  - :open_file_folder: types/
    - :page_facing_up: index.type.ts
  - :open_file_folder: routes/
    - :page_facing_up: index.route.ts
  - :open_file_folder: services/
    - :page_facing_up: index.service.ts
    - :page_facing_up: aws.service.ts
    - :page_facing_up: emailer.service.ts
    - :page_facing_up: fastify.service.ts
    - :page_facing_up: firebase.service.ts
    - :page_facing_up: redis.service.ts
    - :page_facing_up: mongo.service.ts
  - :page_facing_up: index.ts 
- :page_facing_up: example.env 
- :page_facing_up: package.json
- :page_facing_up: postman.json
- :page_facing_up: README.md
- :page_facing_up: tsconfig.json
- :page_facing_up: yarn.lock

## Run

First of all, install [**typescript**](https://www.npmjs.com/package/typescript) and [**nodemon**](https://www.npmjs.com/package/nodemon) gobally with [**yarn**](https://yarnpkg.com/lang/en/).

1. At the repository root, download the dependencies with **yarn**:
```
yarn
```
2. Rename the file *example.env* to *.env*, and edit the environment variables. Some of them are required when using Fastify and TypeORM  as ```JWT_SECRET```,```SERVER_PORT``` and ```MONGO_``` ones.

3. Make sure you're running your database service. Create your collection types in *types/index.type.ts*.

4. Add aditional services at *index.ts* services array, if necessary.

5. Add aditional **.route.ts* files into *index.route.ts* routes array, if necessary.

6. Run **tsc -w** at project root directory.

7. Additionally, run **nodemon** at dist/ directory.

8. Edit src/ TypeScript code with automatic reload!
