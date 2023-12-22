import { Country, Trip } from "@prisma/client";

export interface MyTripQueryData extends Trip {
  Country: Country;
}
