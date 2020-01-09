import { ObjectID, Collection } from "mongodb";

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
