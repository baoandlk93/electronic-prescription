import { Medicine } from "./Medicine";

export interface PrescriptionMedicine {
    id: string;
    prescriptionId: string;
    medicineId: string;
    quantity: number;
    instruction: string;
    medicine: Medicine;
}