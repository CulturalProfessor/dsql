import alasql from "alasql";
import Papa from "papaparse";

interface CSVRow {
  [key: string]: string | number | null;
}

export const loadCSVData = (
  filePath: string,
  setTableName: (name: string) => void,
  setResultData: (data: CSVRow[]) => void,
  setLoading: (loading: boolean) => void
): void => {
  fetch(filePath)
    .then((response) => response.text())
    .then((csvText) => {
      Papa.parse<CSVRow>(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (result: Papa.ParseResult<CSVRow>): void => {
          setLoading(false);
          if (result.data.length === 0) return;

          const columns: string[] = Object.keys(result.data[0]);
          const tableName: string = "orders";

          setTableName(tableName);
          if (alasql.tables[tableName]) {
            alasql(`DROP TABLE ${tableName}`);
          }

          alasql(
            `CREATE TABLE ${tableName} (${columns
              .map((col: string) => `[${col}] STRING`)
              .join(", ")})`
          );
          const insertQuery: string = `INSERT INTO ${tableName} VALUES (${columns
            .map(() => "?")
            .join(", ")})`;

          result.data.forEach((row: CSVRow) => {
            alasql(
              insertQuery,
              columns.map((col: string) => row[col] ?? null)
            );
          });

          setResultData(result.data);
        },
        error: (error: Error): void =>
          console.error("Error parsing CSV:", error),
      });
    })
    .catch((error) => console.error("Error loading CSV:", error));
};

export const generateChartData = (
  data: CSVRow[]
): {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    borderWidth: number;
    pointRadius: number;
  }[];
} | null => {
  if (data.length === 0) return null;

  const keys = Object.keys(data[0]);
  const firstNumericColumn = keys.find(
    (key) => typeof data[0][key] === "number"
  );

  if (!firstNumericColumn) return null;

  return {
    labels: data.map((_, index) => `Row ${index + 1}`),
    datasets: [
      {
        label: firstNumericColumn,
        data: data.map((row) => Number(row[firstNumericColumn]) || 0),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        pointRadius: 2,
      },
    ],
  };
};

export const exportToCSV = (data: CSVRow[]): void => {
  if (data.length === 0) {
    alert("No data to export.");
    return;
  }

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "query_results.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
