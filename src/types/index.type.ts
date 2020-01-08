import { ObjectID, Collection } from "mongodb";

export enum StateType {
  AC = "AC",
  AL = "AL",
  AP = "AP",
  AM = "AM",
  BA = "BA",
  CE = "CE",
  DF = "DF",
  ES = "ES",
  GO = "GO",
  MA = "MA",
  MT = "MT",
  MS = "MS",
  MG = "MG",
  PA = "PA",
  PB = "PB",
  PR = "PR",
  PE = "PE",
  PI = "PI",
  RJ = "RJ",
  RN = "RN",
  RS = "RS",
  RO = "RO",
  RR = "RR",
  SC = "SC",
  SP = "SP",
  SE = "SE",
  TO = "TO"
}

export interface Address {
  complement?: string;
  number: number;
  street: string;
  neighborhood: string;
  city: string;
  state: StateType;
  country: string;
  zipCode: string;
}

export interface User {
  cpf: string;
  name: string;
  sex: "M" | "F";
  birth: Date;
  address: Address;
}

export interface Collections {
  addresses: Collection<Address>;
  users: Collection<User>;
}
