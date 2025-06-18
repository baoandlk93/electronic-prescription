import { Diagnosis } from "./Diagnosis";
import { Medicine } from "./Medicine";
export interface Prescription {
    id: string;
    code: string;
    name: string;
    date: string;
    patientId: string;
    diagnoses: Diagnosis[];
    medicines: Medicine[];
    advice: string;
    followUpDate: string;
}