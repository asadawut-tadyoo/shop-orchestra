import React, { useState, FormEvent, useEffect } from "react";
import PropTypes from "prop-types";
type BarcodeFormProps = {
  label?: string;               // ข้อความ label แสดงเหนือช่อง input
  autoSubmit?: boolean;         // true = submit อัตโนมัติ, false = ต้องกดปุ่ม
  onSubmit: (barcode: string) => void;
  isEnable?:boolean; 
  valueCode:string;
  onChangeCode: (value: string) => void;
};

const BarcodeForm: React.FC<BarcodeFormProps> = ({ 
  label = "Scan Barcode", 
  autoSubmit = true, 
  onSubmit,
  isEnable = true,
  valueCode = "",
  onChangeCode
}) => {
  // const [barcode, setBarcode] = useState(valueCode);
  // const [isClear, setIsClear] = useState(true);
  // useEffect(() => {
  //   setBarcode(valueCode); 
  // }, [valueCode]);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (valueCode.trim() === "") return; // กันช่องว่าง
    onSubmit(valueCode);
    // setBarcode(""); // เคลียร์หลัง submit
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeCode(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (autoSubmit && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-sm">
      {label && <label className="font-medium text-gray-700">{label}</label>}
      
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={valueCode}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Scan barcode here..."
          autoFocus
          className= "border border-gray-300 rounded p-2 flex-1"
          disabled={!isEnable} 
        />
        {/* {!autoSubmit && (
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
          >
            Submit
          </button>
        )} */}
      </div>
    </form>
  );
};
// BarcodeForm.propTypes = {
//   label:PropTypes.string
// }
export default BarcodeForm;
