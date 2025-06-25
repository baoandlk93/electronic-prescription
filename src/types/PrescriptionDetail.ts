import { Diagnosis } from "./Diagnosis";
import { Patient } from "./Patient";
import { PrescriptionMedicine } from "./PrescriptionMedicine";

export interface PrescriptionDetail {
    advice: string;
    code: string;
    createdAt: Date;
    diagnoses: Diagnosis[];
    followUpDate: Date;
    symptom: string;
    id: string;
    items: PrescriptionMedicine[];
    patientId: string;
    patient: Patient;
}
