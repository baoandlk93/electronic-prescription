import { Diagnosis } from "./Diagnosis";
import { Medicine } from "./Medicine";
import { Patient } from "./Patient";
export interface Prescription {
    id: string;
    code: string;
    name: string;
    date: string;
    patientId: string;
    patient: Patient;
    diagnoses: Diagnosis[];
    medicines: Medicine[];
    items: Medicine[];
    advice: string;
    followUpDate: string;
    createdAt: string;
}