import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

const OUTPUT_FILE = path.join("./", "large_orders.csv");
const NUM_ROWS = 99000;

const headers = [
  "orderID",
  "customerID",
  "employeeID",
  "orderDate",
  "requiredDate",
  "shippedDate",
  "shipVia",
  "freight",
  "shipName",
  "shipAddress",
  "shipCity",
  "shipRegion",
  "shipPostalCode",
  "shipCountry",
].join(",");

function generateRow(orderID) {
  return [
    orderID,
    faker.string.alpha(5).toUpperCase(),
    faker.number.int({ min: 1, max: 10 }),
    faker.date.past().toISOString(),
    faker.date.future().toISOString(),
    faker.date.past().toISOString(),
    faker.number.int({ min: 1, max: 3 }),
    faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
    faker.company.name(),
    faker.location.streetAddress(),
    faker.location.city(),
    faker.helpers.maybe(() => faker.location.state(), { probability: 0.8 }),
    faker.helpers.maybe(() => faker.location.zipCode(), { probability: 0.9 }),
    faker.location.country(),
  ].join(",");
}

async function generateCSV() {
  const stream = fs.createWriteStream(OUTPUT_FILE);
  stream.write(headers + "\n");

  for (let i = 10248; i < 10248 + NUM_ROWS; i++) {
    const row = generateRow(i);
    stream.write(row + "\n");
    if (i % 10000 === 0) console.log(`Generated ${i} rows...`);
  }

  stream.end(() => console.log(`CSV file created: ${OUTPUT_FILE}`));
}

generateCSV();
