import { DiagnosisDetail } from "./DiagnosisDetail";

export interface Diagnosis {
    diagnosisId: string;
    prescriptionId: string;
    note: string;
    diagnosis: DiagnosisDetail;
}