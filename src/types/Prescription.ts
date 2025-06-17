import { Diagnosis } from "./Diagnosis";
import { Medicine } from "./Medicine";
import { Patient } from "./Patient";
export interface Prescription {
    code: string;
    name: string;
    date: string;
    patient: Patient;
    diagnoses: Diagnosis[];
    medicines: Medicine[];
}