import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // 1. Patients
  const patientIds: number[] = [];
  for(let i=0; i<100; i++) {
    const patient = await prisma.patient.create({
      data: {
        name: faker.person.fullName(),
        dateOfBirth: faker.date.birthdate({min:1960, max:2018, mode:"year"}),
        gender: faker.helpers.arrayElement(['Nam', 'Nữ']),
        address: faker.location.streetAddress(),
        phone: fakeVNPhone()
      }
    });
    patientIds.push(patient.id);
  }
  function fakeVNPhone(): string {
    const first = faker.number.int({ min: 100, max: 999 });
    const second = faker.number.int({ min: 100, max: 999 });
    const third = faker.number.int({ min: 100, max: 999 });
    return `+84 9${first} ${second} ${third}`;
  }
  // 2. Medicines
  const medicineIds: number[] = [];
  for(let i=0; i<100; i++) {
    const medicine = await prisma.medicine.create({
      data: {
        name: faker.commerce.productName(),
        content: faker.commerce.productMaterial(),
        unit: faker.helpers.arrayElement(['viên', 'gói', 'ống', 'chai', 'tuýp']),
      }
    });
    medicineIds.push(medicine.id);
  }

  // 3. Diagnoses
  const diagnosisIds: number[] = [];
  for(let i=0; i<100; i++) {
    const diagnosis = await prisma.diagnosis.create({
      data: {
        name: faker.lorem.words(3),
        code: 'D' + faker.string.numeric({ length: 4 }),
        description: faker.lorem.sentence(),
      }
    });
    diagnosisIds.push(diagnosis.id);
  }

  // 4. Prescriptions
  const prescriptionIds: number[] = [];
  for(let i=0; i<100; i++) {
    const prescription = await prisma.prescription.create({
      data: {
        code: 'P' + faker.string.numeric({ length: 6 }),
        patientId: faker.helpers.arrayElement(patientIds),
        advice: faker.lorem.words(8),
        // createdAt sẽ tự động theo default
      }
    });
    prescriptionIds.push(prescription.id);
  }

  // 5. PrescriptionDiagnosis (join table)
  for (const prescriptionId of prescriptionIds) {
    const diagnosisCount = faker.number.int({min:1, max:3});
    const chosenDiagnosis = faker.helpers.arrayElements(diagnosisIds, diagnosisCount);
    for (const diagnosisId of chosenDiagnosis) {
      await prisma.prescriptionDiagnosis.create({
        data: {
          prescriptionId,
          diagnosisId,
          note: faker.lorem.words(3),
        }
      });
    }
  }

  // 6. PrescriptionMedicine (join table)
  for (const prescriptionId of prescriptionIds) {
    const medicineCount = faker.number.int({min:1, max:4});
    const chosenMedicine = faker.helpers.arrayElements(medicineIds, medicineCount);
    for (const medicineId of chosenMedicine) {
      await prisma.prescriptionMedicine.create({
        data: {
          prescriptionId,
          medicineId,
          quantity: faker.number.int({min:1, max:10}),
          instruction: faker.lorem.words(5)
        }
      });
    }
  }

  console.log("Đã seed xong dữ liệu mẫu!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
