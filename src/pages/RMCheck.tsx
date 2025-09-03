import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useRawMaterials } from "@/hooks/useApi";
import BarcodeForm from "@/components/form/BarcodeForm";
import axios from "axios";
import RawMaterialScanForm from "@/components/form/RawMaterialScanForm";
import { AssemblyUnit, AssemblyUnitStatus, RawMaterialStatus } from "@/types";
import { assemblyUnitsService } from "@/services/assemblyUnits";
import { Card } from "@/components/ui/card";

export default function RMCheckForm() {
  const [barcode, setBarcode] = useState<string>("");
  const [showCustomerBarcode, setShowCustomerBarcode] =
    useState<boolean>(false);
  const [assemblyUnit, setAssemblyUnit] = useState<AssemblyUnit | null>(null);

  const resetState = () => {
    setBarcode("");
    setShowCustomerBarcode(false);
  };
  // const response: AssemblyUnit = {
  //       id: "AU-001",
  //       serialNumber: "SN-20250902-001",
  //       productCode: "PC-12345",
  //       workOrderId: "WO-20250902",
  //       batchId: "BATCH-009",
  //       stationId: "ST-05",
  //       status: AssemblyUnitStatus.InProgress,
  //       rawMaterials: [
  //         {
  //           id: "RM-001",
  //           code: "MAT-1001",
  //           serialNumber: "RM-SN-001",
  //           lotNumber: "LOT-2025-01",
  //           batchNo: "BATCH-RM-01",
  //           status: RawMaterialStatus.Created,
  //           inspections: [
  //             {
  //               id: "INSP-001",
  //               assemblyUnitId: "AU-001",
  //               rawMaterialId: "RM-001",
  //               targetType: "Material",
  //               targetId: "MAT-1001",
  //               testType: "Visual",
  //               result: "Pass",
  //               measuredValue: "N/A",
  //               inspector: "John Doe",
  //               timestamp: new Date("2025-09-01T08:00:00Z"),
  //             },
  //           ],
  //           description: "Main PCB Board",
  //           quantity: 10,
  //           unit: "pcs",
  //           supplier: "ABC Electronics",
  //           receivedDate: new Date("2025-08-28T10:00:00Z"),
  //         },
  //         {
  //           id: "RM-002",
  //           code: "MAT-1001",
  //           serialNumber: "RM-SN-002",
  //           lotNumber: "LOT-2025-01",
  //           batchNo: "BATCH-RM-01",
  //           status: RawMaterialStatus.Created,
  //           inspections: [
  //             {
  //               id: "INSP-001",
  //               assemblyUnitId: "AU-001",
  //               rawMaterialId: "RM-001",
  //               targetType: "Material",
  //               targetId: "MAT-1001",
  //               testType: "Visual",
  //               result: "Pass",
  //               measuredValue: "N/A",
  //               inspector: "John Doe",
  //               timestamp: new Date("2025-09-01T08:00:00Z"),
  //             },
  //           ],
  //           description: "Main PCB Board",
  //           quantity: 10,
  //           unit: "pcs",
  //           supplier: "ABC Electronics",
  //           receivedDate: new Date("2025-08-28T10:00:00Z"),
  //         },
  //         {
  //           id: "RM-003",
  //           code: "MAT-1001",
  //           serialNumber: "RM-SN-003",
  //           lotNumber: "LOT-2025-01",
  //           batchNo: "BATCH-RM-01",
  //           status: RawMaterialStatus.Created,
  //           inspections: [
  //             {
  //               id: "INSP-001",
  //               assemblyUnitId: "AU-001",
  //               rawMaterialId: "RM-001",
  //               targetType: "Material",
  //               targetId: "MAT-1001",
  //               testType: "Visual",
  //               result: "Pass",
  //               measuredValue: "N/A",
  //               inspector: "John Doe",
  //               timestamp: new Date("2025-09-01T08:00:00Z"),
  //             },
  //           ],
  //           description: "Main PCB Board",
  //           quantity: 10,
  //           unit: "pcs",
  //           supplier: "ABC Electronics",
  //           receivedDate: new Date("2025-08-28T10:00:00Z"),
  //         },
  //       ],
  //       steps: [
  //         {
  //           id: "STEP-001",
  //           name: "Assembly",
  //           stationId: "ST-01",
  //           assemblyUnitId: "AU-001",
  //           startTime: new Date("2025-09-01T09:00:00Z"),
  //           endTime: new Date("2025-09-01T09:30:00Z"),
  //           duration: "30m",
  //         },
  //         {
  //           id: "STEP-002",
  //           name: "Testing",
  //           stationId: "ST-02",
  //           assemblyUnitId: "AU-001",
  //           startTime: new Date("2025-09-01T10:00:00Z"),
  //           // endTime, duration optional
  //         },
  //       ],
  //       inspections: [
  //         {
  //           id: "INSP-002",
  //           assemblyUnitId: "AU-001",
  //           targetType: "Assembly",
  //           targetId: "AU-001",
  //           testType: "Electrical",
  //           result: "Pass",
  //           measuredValue: "12V",
  //           inspector: "Jane Smith",
  //           timestamp: new Date("2025-09-01T11:00:00Z"),
  //         },
  //       ],
  //       usages: [
  //         {
  //           materialCode: "MAT-1001",
  //           serialNumber: "RM-SN-001",
  //           usedAt: new Date("2025-09-01T09:15:00Z"),
  //         },
  //       ],
  //       createdAt: new Date("2025-08-31T15:00:00Z"),
  //       updatedAt: new Date("2025-09-01T12:00:00Z"),
  //     };
  const handleSummitCusCode = async (barcode: string) => {
    // axios
    //   .post("/api/endpoint", { barcode })
    //   .then((response) => {
    //     console.log("Response:", response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
    try {
      const response = await axios.get(
        `http://localhost:5068/api/AssemblyUnits/${barcode}`
      );

      console.log("Response:", response);
      const assemblyUnit = response.data;
      setAssemblyUnit(assemblyUnit);
      setShowCustomerBarcode(true);
    } catch (error) {
      console.log("Error:", error.toJSON());
    }
  };

  const handleSummitMatCode = (barcode: string) => {
    axios
      .post("/api/endpoint", { barcode })
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Raw Material Check</h1>
          <p className="text-muted-foreground mt-1">
            {/* Real-time overview of production activities */}
          </p>
        </div>

        <div className="">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="p-0 ">
              <div className="flex items-center justify-between">
              </div>
              {!showCustomerBarcode ? (
                <BarcodeForm
                  label="Scan Customer Code"
                  onSubmit={handleSummitCusCode}
                ></BarcodeForm>
              ) : (
                <RawMaterialScanForm
                  assemblyUnit={assemblyUnit}
                  onSubmit={handleSummitMatCode}
                  onAccept={resetState}
                ></RawMaterialScanForm>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
