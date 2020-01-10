import { ObjectID, Collection, Db } from "mongodb";

export interface Address {
  complement?: string;
  number: number;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  users: ObjectID[];
}

export interface User {
  cpf: string;
  name: string;
  sex: "M" | "F";
  birth: Date;
}

export interface Collections {
  addresses: Collection<Address>;
  users: Collection<User>;
}

export function getTypesCollections(mongoClient: Db): Collections {
  return {
    users: mongoClient.collection<User>("users"),
    addresses: mongoClient.collection<Address>("addresses")
  };
}
