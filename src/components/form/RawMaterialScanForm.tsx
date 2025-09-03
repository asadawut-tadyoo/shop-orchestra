import { AssemblyUnit } from "@/types";
import React, { useState, FormEvent } from "react";
import BarcodeForm from "./BarcodeForm";
import axios from "axios";
import { RawMaterialStatus } from "@/types"; 

type RawMaterialScanFormProps = {
  label?: string;
  autoSubmit?: boolean;
  onSubmit: (barcode: string) => void;
  assemblyUnit : AssemblyUnit;
  onAccept?: () => void;
};



const RawMaterialScanForm: React.FC<RawMaterialScanFormProps> = ({ 
  label = "Scan Raw Material", 
  autoSubmit = true, 
  onSubmit ,
  assemblyUnit,
  onAccept
}) => {
  const [barcode, setBarcode] = useState("");
  const [showBarcode, setShowBarcode] = useState<boolean>(true);
 

  const handleBarcodeScan = (barcode: string) => {
    setBarcode(barcode);  
    setShowBarcode(true);
  };
  const handleReset = () => { 
    setShowBarcode(true);
  };

  const handleSummitMatCode = async (barcode) => { 
    //#region  Scan material till fullfill Assembly
    //เช็คผ่าน API getAssemblyUnit/{Id}
    try {
      // for (let i = 0; i < assemblyUnit.rawMaterials.length; i++) {
      //   const rawMaterial = assemblyUnit.rawMaterials[i];

      //   if (
      //     rawMaterial.serialNumber === barcode &&
      //     rawMaterial.status === RawMaterialStatus.Received
      //   ) {
      //     //ส่ง API บันทึกค่าทันที
      //     rawMaterial.status = RawMaterialStatus.Consumed;
      //     const response = await axios.post(
      //       `/api/RawMaterials/${rawMaterial.id}`,
      //       { rawMaterial: rawMaterial.toJSON() }
      //     );
      //     break;
      //   }
      // }
      const found = assemblyUnit.rawMaterials.find(
        (rawMaterial) =>
          rawMaterial.serialNumber === barcode &&
          rawMaterial.status === RawMaterialStatus.Received
      );
      if (found) {
        found.status = RawMaterialStatus.Consumed;
        await axios.post(
            `/api/RawMaterials/${found.id}`,
            { rawMaterial: found }
          );
      }
      //#endregion
      setShowBarcode(false); 
    } catch (error) {
      console.error("Error fetching assembly unit:", error);
    }
  };

  return (
    <>
      <BarcodeForm
        label="Scan Raw materials Code"
        onSubmit={() => setShowBarcode(false)}
      ></BarcodeForm>
      {!showBarcode && (
          <div className="flex items-center gap-4 mt-4">
            <button 
              className="bg-green-400 text-white rounded px-4 py-2 hover:bg-blue-600"
              onClick={() => {
                handleSummitMatCode(barcode);
                if (onAccept) onAccept();
              }}
            >
              Accept
            </button>

            <button 
              className="bg-red-600 text-white rounded px-4 py-2 hover:bg-blue-600"
            >
              Reject
            </button>
          </div>
      )}
    </>
  );
};

export default RawMaterialScanForm;


// {assemblyUnit && assemblyUnit.rawMaterials && assemblyUnit.rawMaterials.length > 0 && (
//           <div className="space-y-2">
//             <h3 className="text-xl font-bold">Raw Materials</h3>
//             <ul className="space-y-1">
//               {assemblyUnit.rawMaterials.map((rm) => (
//                 <li key={rm.id} className="border rounded p-2 flex flex-col md:flex-row md:items-center md:gap-4">
//                   <span><b>Serial:</b> {rm.serialNumber}</span>
//                   <span><b>Code:</b> {rm.code}</span>
//                   <span><b>Status:</b> {rm.status}</span>
//                   <span><b>Lot:</b> {rm.lotNumber}</span>
//                   <span><b>Batch:</b> {rm.batchNo}</span>
//                   <span><b>Description:</b> {rm.description}</span>
//                   <span><b>Quantity:</b> {rm.quantity}</span>
//                   <span><b>Unit:</b> {rm.unit}</span>
//                   <span><b>Supplier:</b> {rm.supplier}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}