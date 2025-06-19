import { Diagnosis } from "./Diagnosis";
import { Medicine } from "./Medicine";
import { Patient } from "./Patient";
export interface Prescription {
    id: string;
    code: string;
    name: string;
    createdAt: string;
    patient: Patient;
    diagnoses: Diagnosis[];
    medicines: Medicine[];
    advice: string;
    followUpDate: string;
}