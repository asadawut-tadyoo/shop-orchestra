import { ApiError, AssemblyUnit, RawMaterialStatus } from "@/types";
import React, { useState } from "react";
import BarcodeForm from "./BarcodeForm";
import { assemblyUnitsService } from "@/services/assemblyUnits";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import ConfirmDialog from "../dialog/ConfirmDialog";
type RawMaterialScanFormProps = {
  label?: string;
  autoSubmit?: boolean;
  onSubmit: ()=> void;
  assemblyUnit: AssemblyUnit;
  onAccept?: () => void;
};

const RawMaterialScanForm: React.FC<RawMaterialScanFormProps> = ({ 
  label = "Scan Raw Material", 
  autoSubmit = true, 
  onSubmit,
  assemblyUnit,
  onAccept
}) => {
  const [scannedBarcode, setScannedBarcode] = useState(""); 
  const [showBarCodeForm, setShowBarCodeForm] = useState<boolean>(true); 
  const [showActions, setShowActions] = useState<boolean>(false); 
  const [currentMaterial, setCurrentMaterial] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [consumedMaterials, setConsumedMaterials] = useState<string[]>([]);
  const [isEnableForm, setIsEnableForm] = useState(true); 

  const [errorDialog, setErrorDialog] = useState<{
    isOpen: boolean; 
    message? : string,
    isLoading: boolean;
  }>({ isOpen: false,message:"", isLoading: false });
   

  const handleBarcodeScan = async (barcode: string) => {
    setScannedBarcode(barcode);
    setShowActions(true);
    setIsEnableForm(false);
    // เพิ่ม api aseemblyUnit/test/{rm.id}
  };

  // const [tempMaterialCode, setTempMaterialCode] = useState<string>('');
  //  const [tempSerialNumber, setTempSerialNumber] = useState<string>('');
  const handleAccept = async (barcode: string) => {
    // if (!currentMaterial) return; 
    try {
      const [materialCode, serialNumber] = barcode.split(":");

      // 1) ดึง RawMaterial ID
      const rawMatRes = await axios.get(
        `http://localhost:5068/api/RawMaterials/by-serial/${materialCode}/${serialNumber}`
      );
      const rawMatId = rawMatRes.data.id;

      // 2) ส่ง Inspection
      const inspectionData = {
        testType: "Visual Check",
        result: "Pass",
        measuredValue: "N/A",
        inspector: "John Doe",
      };

      await axios.post(
        `http://localhost:5068/api/RawMaterials/${rawMatId}/inspection`,
        inspectionData
      );

      // 3) เปลี่ยนสถานะ RM → Consumed
      const payload = { materialCode, serialNumber };
      await axios.post(
        `http://localhost:5068/api/AssemblyUnits/${assemblyUnit.id}/consume-rawmaterial`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ สำเร็จ → reset state + callback
      toast.success("Material accepted successfully");
      setScannedBarcode("");
      setShowActions(false);
      setCurrentMaterial(null);

      onAccept?.(); // เรียก parent callback ถ้ามีส่งมา
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

      // reset form ให้กรอกใหม่
      setScannedBarcode("");
      setShowActions(false);
    }

    try {
      // setTempMaterialCode(rawMatId.data.materialCode);
      // setTempSerialNumber(rawMatId.data.serialNumber);
      const statusAssemUnit = await axios.get<AssemblyUnit>(
        `http://localhost:5068/api/AssemblyUnits/${assemblyUnit.id}`
      );
      // statusAssemUnit.status === "Assembled" ? console.log("Assembly Unit Status:", "success") : console.log("No Assembly Unit Status found");
      if (statusAssemUnit.data.status === "Assembled") {
        stopProcess();
      } 
      onSubmit();
      setShowBarCodeForm(false);
      setIsEnableForm(true);
      setScannedBarcode("");
    } catch (error) {
      toast.error("Failed to accept material");
      setErrorDialog({
        isLoading: false,
        message: error.response?.data.detail,
        isOpen: true,
      });
      return;
    }

    // setIsProcessing(true);
    // try {
    //   // Call API to consume raw material
    //   await assemblyUnitsService.consumeRawMaterial(
    //     assemblyUnit.id,
    //     currentMaterial.code,
    //     currentMaterial.serialNumber
    //   );

    //   // Update local state
    //   currentMaterial.status = RawMaterialStatus.Consumed;
    //   setConsumedMaterials([...consumedMaterials, currentMaterial.serialNumber]);

    //   toast.success(`Material ${currentMaterial.code} consumed successfully!`);

    //   // Check if all materials are consumed
    //   const remainingMaterials = assemblyUnit.rawMaterials.filter(
    //     rm => rm.status === RawMaterialStatus.Received && rm.serialNumber !== currentMaterial.serialNumber
    //   );

    //   if (remainingMaterials.length === 0) {
    //     // All materials consumed, change assembly unit status
    //     await assemblyUnitsService.changeStatus(assemblyUnit.id, 'Assembled');
    //     toast.success("All materials consumed! Assembly unit is now Assembled.");

    //     if (onAccept) {
    //       onAccept();
    //     }
    //   } else {
    //     toast.info(`${remainingMaterials.length} materials remaining to scan.`);
    //   }

    // Reset for next scan
    // setScannedBarcode("");
    // setShowActions(false);
    // setCurrentMaterial(null);
  };

  const stopProcess = async () => {
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
      return;
    }

    try {
      const processStep = {
        name: "product_01",
        stationId: station.id,
        isOnProcess: false,
      };
      await axios.post(
        `http://localhost:5068/api/AssemblyUnits/${assemblyUnit.serialNumber}/add-processstep`,
        processStep
      );
    } catch (error) {
      console.log("Error fetching assemblyUnits:", error.toJSON());
    }
  };

  const handleReject = async (barcode: string) => { 

    setIsProcessing(true);
    let rawMatId;
    try {
      const [materialCode, serialNumber] = barcode.split(":"); // ตัดค่าตามเครื่องหมาย :
      const payload = {
        materialCode,
        serialNumber 
      };
      rawMatId = await axios.post(
        `http://localhost:5068/api/RawMaterials/by-serial/${payload.materialCode}/${payload.serialNumber}`
      );
    } catch (error) {
      setIsProcessing(false); 
      if (axios.isAxiosError<ApiError>(error)) {
        toast.error("Failed to accept material");
        setErrorDialog({
          isLoading: false,
          message: error.response?.data.detail,
          isOpen: true,
        }); 
      }
      return;
    }
    try {
      // Update material status to Scrapped
      // currentMaterial.status = RawMaterialStatus.Scrapped;
      // setTempMaterialCode(rawMatId.data.materialCode);
      // setTempSerialNumber(rawMatId.data.serialNumber);
      const inspectionData = {
        testType: "Visual Check", // หรือค่าที่คุณต้องการ
        result: "Fail", // หรือ "Failed"
        measuredValue: "N/A", // ถ้าไม่มีค่าก็ใส่ "N/A" หรือ "" ได้
        inspector: "John Doe", // ชื่อผู้ตรวจสอบ
      };

      await axios.post(
        `http://localhost:5068/api/RawMaterials/${rawMatId.data.id}/inspection`,
        inspectionData
      );
      setShowActions(true);
      // In a real scenario, you would call an API to update this
      // For now, we'll just update locally
      // toast.warning(`Material ${currentMaterial.code} marked as scrapped.`);

      // Reset for next scan
      onAccept?.();
      setScannedBarcode("");
      setShowActions(false);
      setCurrentMaterial(null);
    } catch (error: any) {
      if (axios.isAxiosError<ApiError>(error)) {
        setErrorDialog({
          isLoading: false,
          message: error.response?.data.detail ?? "Unknown error",
          isOpen: true,
        });
      }
      return;
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate progress
  // const totalMaterials = assemblyUnit.usages.length;
  // const consumedCount = assemblyUnit.rawMaterials.filter(
  //   rm => rm.status === RawMaterialStatus.Consumed
  // ).length + consumedMaterials.length;
  // const progress = totalMaterials > 0 ? (consumedCount / totalMaterials) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      {/* <Card className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Scanning Progress</span>
            <span className="text-muted-foreground">{consumedCount}/{totalMaterials} materials</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </Card> */}

      {/* Assembly Unit Info */}
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Product Code:</span>{" "}
            {assemblyUnit.productCode}
          </div>
          <div>
            <span className="font-medium">Serial Number:</span>{" "}
            {assemblyUnit.serialNumber}
          </div>
          {/* <div>
            <span className="font-medium">Work Order:</span> {assemblyUnit.workOrderId}
          </div> */}
          <div>
            <span className="font-medium">Status:</span> {assemblyUnit.status}
          </div>
        </div>
      </Card>

      {/* Barcode Scanner */} 
       {showBarCodeForm && (
        <BarcodeForm
          label="Scan Raw Material Code"
          onSubmit={handleBarcodeScan}
          autoSubmit={autoSubmit}
          isEnable = {isEnableForm} 
          valueCode={scannedBarcode}
          onChangeCode={setScannedBarcode}
        />  
       )}
        
      {/* Action Buttons */}
      {showActions && (
        <Card className="p-6 space-y-4">
          {/* <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Material Scanned
            </h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">Code:</span>{" "}
                {currentMaterial.code}
              </div>
              <div>
                <span className="font-medium">Serial:</span>{" "}
                {currentMaterial.serialNumber}
              </div>
              <div>
                <span className="font-medium">Description:</span>{" "}
                {currentMaterial.description}
              </div>
              <div>
                <span className="font-medium">Lot Number:</span>{" "}
                {currentMaterial.lotNumber}
              </div>
              <div>
                <span className="font-medium">Supplier:</span>{" "}
                {currentMaterial.supplier}
              </div>
            </div>
          </div> */}

          <div className="flex items-center gap-4">
            <Button
              className="flex-1"
              onClick={() => handleAccept(scannedBarcode)}
              disabled={isProcessing}
              variant="default"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Accept
            </Button>

            <Button
              className="flex-1"
              onClick={() => handleReject(scannedBarcode)}
              disabled={isProcessing}
              variant="destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        </Card>
      )}

      {errorDialog.isOpen && (
        <ConfirmDialog
          isOpen={errorDialog.isOpen}
          message={errorDialog.message} 
          title='Error'
          onCancel={()=> setErrorDialog({isOpen:false, isLoading:true})}
          isLoading={errorDialog.isLoading}
        ></ConfirmDialog>
      )}

      {/* Raw Materials List
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Raw Materials in BOM</h3>
        <div className="space-y-2">
          {assemblyUnit.rawMaterials.map((rm) => (
            <div 
              key={rm.id} 
              className={`p-3 border rounded-lg text-sm ${
                rm.status === RawMaterialStatus.Consumed || consumedMaterials.includes(rm.serialNumber) 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                  : rm.status === RawMaterialStatus.Scrapped 
                  ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  : 'bg-background'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="font-medium">{rm.code} - {rm.description}</div>
                  <div className="text-xs text-muted-foreground">
                    Serial: {rm.serialNumber} | Lot: {rm.lotNumber}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  rm.status === RawMaterialStatus.Consumed || consumedMaterials.includes(rm.serialNumber)
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : rm.status === RawMaterialStatus.Scrapped
                    ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    : rm.status === RawMaterialStatus.Received
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                }`}>
                  {consumedMaterials.includes(rm.serialNumber) ? 'Consumed' : rm.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card> */}
    </div>
  );
};

export default RawMaterialScanForm;