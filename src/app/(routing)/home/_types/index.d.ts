import { Country, Trip } from "@prisma/client";

export interface TripQueryData extends Trip {
  Country: Country;
}
