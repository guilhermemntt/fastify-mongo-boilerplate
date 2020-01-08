import { mongoService } from "../services/mongo.service";
import fastify from "fastify";
import { User } from "../types/index.type";
import { ObjectID } from "mongodb";

interface userController {
  get: fastify.RequestHandler;
  find: fastify.RequestHandler;
  add: fastify.RequestHandler;
  update: fastify.RequestHandler;
  delete: fastify.RequestHandler;
}

let userController: userController = {
  get: async (request, reply) => {
    try {
      const users: User[] = await mongoService
        .getCollections()
        .users.find()
        .toArray();

      reply.status(200).send(users);
    } catch (error) {
      console.log(error);
      reply.status(500).send();
    }
  },
  find: async (request, reply) => {
    try {
      const { _id } = request.params;

      const user: User = await mongoService
        .getCollections()
        .users.findOne({ _id: new ObjectID(_id) });

      reply.status(200).send(user);
    } catch (error) {
      console.log(error);
      reply.status(500).send();
    }
  },
  add: async (request, reply) => {
    try {
      const user = await mongoService
        .getCollections()
        .users.insertOne(request.body);

      reply.status(200).send(user);
    } catch (error) {
      console.log(error);
      reply.status(500).send();
    }
  },
  update: async (request, reply) => {
    try {
      const { _id } = request.body;

      const user = await mongoService.getCollections().users.updateOne(
        { _id: new ObjectID(_id) },
        {
          $set: request.body
        }
      );

      reply.status(200).send(user);
    } catch (error) {
      console.log(error);
      reply.status(500).send();
    }
  },
  delete: async (request, reply) => {
    try {
      const { _id } = request.params;

      const user = await mongoService
        .getCollections()
        .users.deleteOne({ _id: new ObjectID(_id) });

      reply.status(200).send(user);
    } catch (error) {
      console.log(error);
      reply.status(500).send();
    }
  }
};

export { userController };
