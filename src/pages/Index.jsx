import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { toast } from "sonner";
import Papa from "papaparse";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setHeaders(Object.keys(result.data[0]));
          setCsvData(result.data);
        },
        error: (error) => {
          toast.error("Failed to parse CSV file");
          console.error("Error parsing CSV file:", error);
        },
      });
    } else {
      toast.error("Please upload a valid CSV file");
    }
  };

  const handleAddRow = () => {
    setCsvData([...csvData, {}]);
  };

  const handleRemoveRow = (index) => {
    setCsvData(csvData.filter((_, i) => i !== index));
  };

  const handleDownload = () => {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCellChange = (rowIndex, columnId, value) => {
    const updatedData = csvData.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [columnId]: value };
      }
      return row;
    });
    setCsvData(updatedData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">CSV Upload and Edit Tool</h1>
      <p className="mb-4">Upload a CSV file, edit the data, and download the edited version.</p>
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
      {csvData.length > 0 && (
        <>
          <Table>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header) => (
                    <td key={header}>
                      <Input
                        value={row[header] || ""}
                        onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                      />
                    </td>
                  ))}
                  <td>
                    <Button variant="destructive" onClick={() => handleRemoveRow(rowIndex)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="mt-4">
            <Button onClick={handleAddRow}>Add Row</Button>
            <Button onClick={handleDownload} className="ml-2">
              Download CSV
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
