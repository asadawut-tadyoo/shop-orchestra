import { AssemblyUnit, RawMaterialStatus } from "@/types";
import React, { useState } from "react";
import BarcodeForm from "./BarcodeForm";
import { assemblyUnitsService } from "@/services/assemblyUnits";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

type RawMaterialScanFormProps = {
  label?: string;
  autoSubmit?: boolean;
  onSubmit: (barcode: string) => void;
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
  const [showActions, setShowActions] = useState<boolean>(false);
  const [currentMaterial, setCurrentMaterial] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [consumedMaterials, setConsumedMaterials] = useState<string[]>([]);

  const handleBarcodeScan = async (barcode: string) => {
    setScannedBarcode(barcode);
    
    // Check if material exists in BOM and has status Received
    const material = assemblyUnit.rawMaterials.find(
      rm => rm.serialNumber === barcode && rm.status === RawMaterialStatus.Received
    );

    if (!material) {
      // Check if already consumed
      const consumed = assemblyUnit.rawMaterials.find(
        rm => rm.serialNumber === barcode && rm.status === RawMaterialStatus.Consumed
      );
      
      if (consumed) {
        toast.error("This material has already been consumed!");
      } else {
        toast.error("Material not found in BOM or not in 'Received' status!");
      }
      
      // Reset to scan again
      setScannedBarcode("");
      setShowActions(false);
      return;
    }

    setCurrentMaterial(material);
    setShowActions(true);
    onSubmit(barcode);
  };

  const handleAccept = async () => {
    if (!currentMaterial) return;
    
    setIsProcessing(true);
    try {
      // Call API to consume raw material
      await assemblyUnitsService.consumeRawMaterial(
        assemblyUnit.id,
        currentMaterial.code,
        currentMaterial.serialNumber
      );

      // Update local state
      currentMaterial.status = RawMaterialStatus.Consumed;
      setConsumedMaterials([...consumedMaterials, currentMaterial.serialNumber]);
      
      toast.success(`Material ${currentMaterial.code} consumed successfully!`);

      // Check if all materials are consumed
      const remainingMaterials = assemblyUnit.rawMaterials.filter(
        rm => rm.status === RawMaterialStatus.Received && rm.serialNumber !== currentMaterial.serialNumber
      );

      if (remainingMaterials.length === 0) {
        // All materials consumed, change assembly unit status
        await assemblyUnitsService.changeStatus(assemblyUnit.id, 'Assembled');
        toast.success("All materials consumed! Assembly unit is now Assembled.");
        
        if (onAccept) {
          onAccept();
        }
      } else {
        toast.info(`${remainingMaterials.length} materials remaining to scan.`);
      }

      // Reset for next scan
      setScannedBarcode("");
      setShowActions(false);
      setCurrentMaterial(null);
      
    } catch (error: any) {
      console.error("Error consuming material:", error);
      toast.error(error.response?.data?.message || "Failed to consume material");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!currentMaterial) return;
    
    setIsProcessing(true);
    try {
      // Update material status to Scrapped
      currentMaterial.status = RawMaterialStatus.Scrapped;
      
      // In a real scenario, you would call an API to update this
      // For now, we'll just update locally
      toast.warning(`Material ${currentMaterial.code} marked as scrapped.`);

      // Reset for next scan
      setScannedBarcode("");
      setShowActions(false);
      setCurrentMaterial(null);
      
    } catch (error: any) {
      console.error("Error rejecting material:", error);
      toast.error("Failed to reject material");
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate progress
  const totalMaterials = assemblyUnit.rawMaterials.length;
  const consumedCount = assemblyUnit.rawMaterials.filter(
    rm => rm.status === RawMaterialStatus.Consumed
  ).length + consumedMaterials.length;
  const progress = totalMaterials > 0 ? (consumedCount / totalMaterials) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card className="p-4">
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
      </Card>

      {/* Assembly Unit Info */}
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Product Code:</span> {assemblyUnit.productCode}
          </div>
          <div>
            <span className="font-medium">Serial Number:</span> {assemblyUnit.serialNumber}
          </div>
          <div>
            <span className="font-medium">Work Order:</span> {assemblyUnit.workOrderId}
          </div>
          <div>
            <span className="font-medium">Status:</span> {assemblyUnit.status}
          </div>
        </div>
      </Card>

      {/* Barcode Scanner */}
      {!showActions && (
        <BarcodeForm
          label="Scan Raw Material Code"
          onSubmit={handleBarcodeScan}
          autoSubmit={autoSubmit}
        />
      )}

      {/* Action Buttons */}
      {showActions && currentMaterial && (
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Material Scanned
            </h3>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Code:</span> {currentMaterial.code}</div>
              <div><span className="font-medium">Serial:</span> {currentMaterial.serialNumber}</div>
              <div><span className="font-medium">Description:</span> {currentMaterial.description}</div>
              <div><span className="font-medium">Lot Number:</span> {currentMaterial.lotNumber}</div>
              <div><span className="font-medium">Supplier:</span> {currentMaterial.supplier}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              className="flex-1"
              onClick={handleAccept}
              disabled={isProcessing}
              variant="default"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Accept (Consume)
            </Button>

            <Button 
              className="flex-1"
              onClick={handleReject}
              disabled={isProcessing}
              variant="destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject (Scrap)
            </Button>
          </div>
        </Card>
      )}

      {/* Raw Materials List */}
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
      </Card>
    </div>
  );
};

export default RawMaterialScanForm;