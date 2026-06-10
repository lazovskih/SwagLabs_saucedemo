import fs from "fs";
import path from "path";

export interface ProductData {
  Id: string;
  Name: string;
  Description: string;
  Price: number;
  imageUrl: string;
}

export interface ShippingData {
  FirstName: string;
  LastName: string;
  PostalCode: string;
}

const DATA_DIR = path.resolve(__dirname, "../../data");

/**
 * Loads and parses a JSON file from the /data directory.
 *
 * @param fileName - Name of the JSON file without extension (e.g. "products")
 * @returns Parsed array of the given type T
 *
 * @example
 * const products = loadTestData<ProductData>("products");
 */
export function loadTestData<T>(fileName: string): T[] {
  const filePath = path.join(DATA_DIR, `${fileName}.json`);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T[];
}
