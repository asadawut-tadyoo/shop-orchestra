import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import BarcodeForm from "@/components/form/BarcodeForm";
import RawMaterialScanForm from "@/components/form/RawMaterialScanForm";
import { AssemblyUnit, AssemblyUnitStatus } from "@/types";
import { assemblyUnitsService } from "@/services/assemblyUnits";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

export default function RMCheckForm() {
  const [barcode, setBarcode] = useState<string>("");
  const [showRawMaterialScan, setShowRawMaterialScan] = useState<boolean>(false);
  const [assemblyUnit, setAssemblyUnit] = useState<AssemblyUnit | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const resetState = () => {
    setBarcode("");
    setShowRawMaterialScan(false);
    setAssemblyUnit(null);
  };

  const handleSummitCusCode = async (barcode: string) => {
    try {
      // Parse QR Code format: ProductCode:SerialNumber
      const [productCode, serialNumber] = barcode.split(':');
      
      if (!productCode || !serialNumber) {
        setAlertMessage("Invalid QR Code format. Expected format: ProductCode:SerialNumber");
        setShowAlert(true);
        resetState();
        return;
      }

      // Get assembly unit by serial number
      const assemblyUnit = await assemblyUnitsService.getBySerial(productCode, serialNumber);
      
      // Check assembly unit status
      if (assemblyUnit.status !== AssemblyUnitStatus.Created) {
        if (assemblyUnit.status === AssemblyUnitStatus.Assembled) {
          setAlertMessage("This assembly unit has already been assembled. All raw materials have been consumed.");
        } else {
          setAlertMessage(`Invalid assembly unit status: ${assemblyUnit.status}. Only units with status 'Created' can proceed.`);
        }
        setShowAlert(true);
        resetState();
        return;
      }

      // Check if all raw materials are already consumed
      const allConsumed = assemblyUnit.rawMaterials.every(
        rm => rm.status === 'Consumed'
      );
      
      if (allConsumed) {
        setAlertMessage("All raw materials have already been consumed for this assembly unit.");
        setShowAlert(true);
        resetState();
        return;
      }

      // If validation passes, proceed to raw material scanning
      setAssemblyUnit(assemblyUnit);
      setShowRawMaterialScan(true);
      toast.success("Assembly unit validated. Please scan raw materials.");
      
    } catch (error: any) {
      console.error("Error fetching assembly unit:", error);
      toast.error(error.response?.data?.message || "Failed to fetch assembly unit");
      resetState();
    }
  };

  const handleRawMaterialProcessed = () => {
    // Check if all raw materials are consumed
    if (assemblyUnit) {
      const allConsumed = assemblyUnit.rawMaterials.every(
        rm => rm.status === 'Consumed'
      );
      
      if (allConsumed) {
        setAlertMessage("All raw materials have been successfully consumed. Assembly unit is complete!");
        setShowAlert(true);
        resetState();
      }
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Raw Material Check</h1>
          <p className="text-muted-foreground mt-1">
            Scan customer barcode to begin raw material consumption process
          </p>
        </div>

        <div className="">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="p-0 ">
              <div className="flex items-center justify-between">
              </div>
              {!showRawMaterialScan ? (
                <BarcodeForm
                  label="Scan Customer Code (ProductCode:SerialNumber)"
                  onSubmit={handleSummitCusCode}
                />
              ) : (
                <RawMaterialScanForm
                  assemblyUnit={assemblyUnit!}
                  onSubmit={() => {}}
                  onAccept={handleRawMaterialProcessed}
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>System Alert</AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => setShowAlert(false)}>
            OK
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}