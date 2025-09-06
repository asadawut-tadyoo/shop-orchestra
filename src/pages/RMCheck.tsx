import { useState } from "react";
import BarcodeForm from "@/components/form/BarcodeForm";
import RawMaterialScanForm from "@/components/form/RawMaterialScanForm";
import { AssemblyUnit } from "@/types";
import { assemblyUnitsService } from "@/services/assemblyUnits";
import { workOrdersService } from "@/services/workOrders";
import { stationsService } from "@/services/stations";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function RMCheckForm() {
  const [barcode, setBarcode] = useState<string>("");
  const [showCustomerBarcode, setShowCustomerBarcode] = useState<boolean>(false);
  const [assemblyUnit, setAssemblyUnit] = useState<AssemblyUnit | null>(null);
  const { toast } = useToast();
  
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
    try {
      // Parse the barcode to extract work order number and serial number
      const [workOrderNo, serialNumber] = barcode.split(":");
      
      if (!workOrderNo || !serialNumber) {
        toast({
          title: "Invalid barcode format",
          description: "Barcode should be in format: WorkOrderNo:SerialNumber",
          variant: "destructive"
        });
        return;
      }

      // Get work order by number
      const workOrder = await workOrdersService.getByNumber(workOrderNo);
      
      // Get assembly unit by serial number
      const assemblyUnit = await assemblyUnitsService.getBySerial(workOrder.id, serialNumber);
      
      // Get stations and find MainAssembly1
      const stationsResponse = await stationsService.getAll();
      const station = stationsResponse.data?.find(s => s.name === "MainAssembly1");
      
      if (!station) {
        toast({
          title: "Station not found",
          description: "MainAssembly1 station not found",
          variant: "destructive"
        });
        return;
      }

      // Add process step to assembly unit
      const processStep = {
        name: "product_01",
        stationId: station.id,
        isOnProcess: true,
      };
      
      const updatedAssemblyUnit = await assemblyUnitsService.addProcessStep(
        assemblyUnit.id,
        processStep
      );
      
      setAssemblyUnit(updatedAssemblyUnit);
      setShowCustomerBarcode(true);
      
      toast({
        title: "Accept SerialNumber",
        description: "Process step added successfully"
      });
    } catch (error: any) {
      toast({
        title: "Failed to submit code",
        description: error.response?.data?.detail || error.message || "Unexpected error",
        variant: "destructive"
      });
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
    <>
      <div className="p-6 space-y-6">
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
                />
              ) : (
                <RawMaterialScanForm
                  assemblyUnit={assemblyUnit}
                  onSubmit={() => setShowCustomerBarcode(false)}
                  onAccept={resetState}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
