"use client";
import { useState } from "react";
import { InputNumber } from "antd";

const InstructionForm = ({ onSuccess }: { onSuccess?: (data: any) => void }) => {
    const [instructions, setInstructions] = useState<{ morning: number; noon: number; evening: number }>({ morning: 0, noon: 0, evening: 0 });
    const [data, setData] = useState("")

    const handleChange = (time: string, value: number | null) => {
        if (value !== null) {
            setInstructions((prev) => ({ ...prev, [time]: value }));
            console.log({ ...instructions, [time]: value }); // In ra giá trị cập nhật
            setData(`Sáng: ${instructions.morning} Trưa: ${instructions.noon} Tối: ${instructions.evening}`)
        } else {
            console.log(`Giá trị ${time} không hợp lệ.`);
        }
        if (onSuccess) {
            console.log(data);
            onSuccess(data);
        }
    };

    return (
        <>
            <div className="flex  gap-1 items-center justify-center">
                <div className="flex gap-1 items-center">
                    <span>Sáng</span>
                    <InputNumber
                        min={1}
                        onChange={(value) => handleChange("morning", value)}
                    />
                </div>
                <div className="flex gap-1 items-center">
                    <span>Trưa</span>
                    <InputNumber
                        min={1}
                        onChange={(value) => handleChange("noon", value)}
                    />
                </div>
                <div className="flex gap-1 items-center">
                    <span>Tối</span>
                    <InputNumber
                        min={1}
                        onChange={(value) => handleChange("evening", value)}
                    />
                </div>
            </div>
        </>
    );
};

export default InstructionForm;