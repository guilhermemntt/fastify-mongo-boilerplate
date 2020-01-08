import { createConnection, DatabaseType, ConnectionOptions } from "typeorm";
import path from "path";
import { Service } from "./index.service";

const typeormService: Service = {
  init: async () => {
    try {
      await createConnection({
        type: process.env.DB_TYPE as DatabaseType,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [
          path.resolve(__dirname, "../entities/*.js"),
          path.resolve(__dirname, "../entities/*.js.map"),
          path.resolve(__dirname, "../entities/*.ts")
        ],
        synchronize: true
      } as ConnectionOptions);

      console.log("Database service initialized.");
    } catch (error) {
      throw error;
    }
  }
};

export { typeormService };
