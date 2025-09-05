import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useRawMaterials } from "@/hooks/useApi";
import BarcodeForm from "@/components/form/BarcodeForm";
import axios from "axios";
import RawMaterialScanForm from "@/components/form/RawMaterialScanForm";
import { ApiError, AssemblyUnit, AssemblyUnitStatus, RawMaterialStatus, Station } from "@/types";
import { assemblyUnitsService } from "@/services/assemblyUnits";
import { Card } from "@/components/ui/card";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import { toast } from "sonner";

export default function RMCheckForm() {
  const [barcode, setBarcode] = useState<string>("");
  const [showCustomerBarcode, setShowCustomerBarcode] =
    useState<boolean>(false);
  const [assemblyUnit, setAssemblyUnit] = useState<AssemblyUnit | null>(null);

  const resetState = () => {
    setBarcode("");
    setShowCustomerBarcode(false);
  }; 

  const [errorDialog, setErrorDialog] = useState<{
      isOpen: boolean; 
      message? : string,
      isLoading: boolean;
    }>({ isOpen: false,message:"", isLoading: false });
  //   const responseDT : AssemblyUnit[]= [ {
  //   id: "AU-001",
  //   serialNumber: "SN-20250902-001",
  //   productCode: "PC-12345",
  //   workOrderId: "WO-20250902",
  //   batchId: "BATCH-009",
  //   stationId: "ST-05",
  //   status: AssemblyUnitStatus.InProgress,
  //   rawMaterials: [
  //     {
  //       id: "RM-001",
  //       code: "MAT-1001",
  //       serialNumber: "RM-SN-001",
  //       lotNumber: "LOT-2025-01",
  //       batchNo: "BATCH-RM-01",
  //       status: RawMaterialStatus.Received,
  //       inspections: [
  //         {
  //           id: "INSP-001",
  //           assemblyUnitId: "AU-001",
  //           rawMaterialId: "RM-001",
  //           targetType: "Material",
  //           targetId: "MAT-1001",
  //           testType: "Visual",
  //           result: "Pass",
  //           measuredValue: "N/A",
  //           inspector: "John Doe",
  //           timestamp: new Date("2025-09-01T08:00:00Z")
  //         }
  //       ],
  //       description: "Main PCB Board",
  //       quantity: 10,
  //       unit: "pcs",
  //       supplier: "ABC Electronics",
  //       receivedDate: new Date("2025-08-28T10:00:00Z"),
  //       assemblyUnitId: ""
  //     }
  //   ],
  //   steps: [
  //     {
  //       id: "STEP-001",
  //       name: "Assembly",
  //       stationId: "ST-01",
  //       assemblyUnitId: "AU-001",
  //       startTime: new Date("2025-09-01T09:00:00Z"),
  //       endTime: new Date("2025-09-01T09:30:00Z"),
  //       duration: "30m"
  //     },
  //     {
  //       id: "STEP-002",
  //       name: "Testing",
  //       stationId: "ST-02",
  //       assemblyUnitId: "AU-001",
  //       startTime: new Date("2025-09-01T10:00:00Z")
  //       // endTime, duration optional
  //     }
  //   ],
  //   inspections: [
  //     {
  //       id: "INSP-002",
  //       assemblyUnitId: "AU-001",
  //       targetType: "Assembly",
  //       targetId: "AU-001",
  //       testType: "Electrical",
  //       result: "Pass",
  //       measuredValue: "12V",
  //       inspector: "Jane Smith",
  //       timestamp: new Date("2025-09-01T11:00:00Z")
  //     }
  //   ],
  //   usages: [
  //     {
  //       materialCode: "MAT-1001",
  //       serialNumber: "RM-SN-001",
  //       usedAt: new Date("2025-09-01T09:15:00Z")
  //     }
  //   ],
  //   createdAt: new Date("2025-08-31T15:00:00Z"),
  //   updatedAt: new Date("2025-09-01T12:00:00Z")
  // }]
  const handleSummitCusCode = async (barcode: string) => {
    let station;
    // const [tempStation, setTempStation] = useState<Station | null>(null);
    try {
      const response = await axios.get("http://localhost:5068/api/Stations");
      const stations = response.data as {
        id: string;
        name: string;
        location: string;
        stationType: string;
      }[];
      station = stations.find((s) => s.name === "MainAssembly1");
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        setErrorDialog({
          isLoading: false,
          message: error.response?.data.detail ?? "Unexpected error",
          isOpen: true,
        });
      } else {
        setErrorDialog({
          isLoading: false,
          message: "Unknown error occurred",
          isOpen: true,
        });
      }
      toast.error("Failed to accept material");
      return;
    }
    let assemblyUnitId;

    try {
      assemblyUnitId = await axios.get<AssemblyUnit>(
        `http://localhost:5068/api/AssemblyUnits/by-serial/${barcode}`
      );
    } catch (error) {
       if (axios.isAxiosError<ApiError>(error)) {
        setErrorDialog({
          isLoading: false,
          message: error.response?.data.detail ?? "Unexpected error",
          isOpen: true,
        });
      } else {
        setErrorDialog({
          isLoading: false,
          message: "Unknown error occurred",
          isOpen: true,
        });
      }
      toast.error("Failed to accept material");
      return; 
    }
    try {
      const processStep = {
        name: "product_01",
        stationId: station.id,
        isOnProcess: true,
      };
      const response = await axios.post(
        `http://localhost:5068/api/AssemblyUnits/${assemblyUnitId.data.id}/add-processstep`,
        processStep
      );

      console.log("Response:", response.data);
      const assemblyUnit: AssemblyUnit = response.data;
      setAssemblyUnit(assemblyUnit);
      setShowCustomerBarcode(true);
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        setErrorDialog({
          isLoading: false,
          message: error.response?.data.detail ?? "Unexpected error",
          isOpen: true,
        });
      } else {
        setErrorDialog({
          isLoading: false,
          message: "Unknown error occurred",
          isOpen: true,
        });
      }
      toast.error("Failed to accept material");
      return;
    }
  };

  // const handleSummitMatCode = (barcode: string) => {
  //   axios
  //     .post("/api/endpoint", { barcode })
  //     .then((response) => {
  //       console.log("Response:", response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // };

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
              <div className="flex items-center justify-between"></div>
              {!showCustomerBarcode ? (
                <BarcodeForm
                  label="Scan Customer Code"
                  valueCode={barcode}
                  onSubmit={handleSummitCusCode}
                  onChangeCode={setBarcode}
                ></BarcodeForm>
              ) : (
                <RawMaterialScanForm
                  assemblyUnit={assemblyUnit}
                  onSubmit={() => setShowCustomerBarcode(false)}
                  onAccept={resetState}
                ></RawMaterialScanForm>
              )}
            </div>
          </Card>
        </div>
      </div>

        {errorDialog.isOpen && (
        <ConfirmDialog
          isOpen={errorDialog.isOpen}
          message={errorDialog.message} 
          title='Error'
          onCancel={()=> setErrorDialog({isOpen:false, isLoading:true})}
          isLoading={errorDialog.isLoading}
        ></ConfirmDialog>
      )}
    </Layout>
  );
}
