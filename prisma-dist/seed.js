"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var faker_1 = require("@faker-js/faker");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        function fakeVNPhone() {
            var first = faker_1.faker.number.int({ min: 100, max: 999 });
            var second = faker_1.faker.number.int({ min: 100, max: 999 });
            var third = faker_1.faker.number.int({ min: 100, max: 999 });
            return "+84 9".concat(first, " ").concat(second, " ").concat(third);
        }
        var patientIds, i, patient, medicineIds, i, medicine, diagnosisIds, i, diagnosis, prescriptionIds, i, prescription, _i, prescriptionIds_1, prescriptionId, diagnosisCount, chosenDiagnosis, _a, chosenDiagnosis_1, diagnosisId, _b, prescriptionIds_2, prescriptionId, medicineCount, chosenMedicine, _c, chosenMedicine_1, medicineId;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    patientIds = [];
                    i = 0;
                    _d.label = 1;
                case 1:
                    if (!(i < 100)) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.patient.create({
                            data: {
                                name: faker_1.faker.person.fullName(),
                                dateOfBirth: faker_1.faker.date.birthdate({ min: 1960, max: 2018, mode: "year" }),
                                gender: faker_1.faker.helpers.arrayElement(['Nam', 'Nữ']),
                                address: faker_1.faker.location.streetAddress(),
                                phone: fakeVNPhone()
                            }
                        })];
                case 2:
                    patient = _d.sent();
                    patientIds.push(patient.id);
                    _d.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    medicineIds = [];
                    i = 0;
                    _d.label = 5;
                case 5:
                    if (!(i < 100)) return [3 /*break*/, 8];
                    return [4 /*yield*/, prisma.medicine.create({
                            data: {
                                name: faker_1.faker.commerce.productName(),
                                content: faker_1.faker.commerce.productMaterial(),
                                unit: faker_1.faker.helpers.arrayElement(['viên', 'gói', 'ống', 'chai', 'tuýp']),
                            }
                        })];
                case 6:
                    medicine = _d.sent();
                    medicineIds.push(medicine.id);
                    _d.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8:
                    diagnosisIds = [];
                    i = 0;
                    _d.label = 9;
                case 9:
                    if (!(i < 100)) return [3 /*break*/, 12];
                    return [4 /*yield*/, prisma.diagnosis.create({
                            data: {
                                name: faker_1.faker.lorem.words(3),
                                code: 'D' + faker_1.faker.string.numeric({ length: 4 }),
                                description: faker_1.faker.lorem.sentence(),
                            }
                        })];
                case 10:
                    diagnosis = _d.sent();
                    diagnosisIds.push(diagnosis.id);
                    _d.label = 11;
                case 11:
                    i++;
                    return [3 /*break*/, 9];
                case 12:
                    prescriptionIds = [];
                    i = 0;
                    _d.label = 13;
                case 13:
                    if (!(i < 100)) return [3 /*break*/, 16];
                    return [4 /*yield*/, prisma.prescription.create({
                            data: {
                                code: 'P' + faker_1.faker.string.numeric({ length: 6 }),
                                patientId: faker_1.faker.helpers.arrayElement(patientIds),
                                advice: faker_1.faker.lorem.words(8),
                                // createdAt sẽ tự động theo default
                            }
                        })];
                case 14:
                    prescription = _d.sent();
                    prescriptionIds.push(prescription.id);
                    _d.label = 15;
                case 15:
                    i++;
                    return [3 /*break*/, 13];
                case 16:
                    _i = 0, prescriptionIds_1 = prescriptionIds;
                    _d.label = 17;
                case 17:
                    if (!(_i < prescriptionIds_1.length)) return [3 /*break*/, 22];
                    prescriptionId = prescriptionIds_1[_i];
                    diagnosisCount = faker_1.faker.number.int({ min: 1, max: 3 });
                    chosenDiagnosis = faker_1.faker.helpers.arrayElements(diagnosisIds, diagnosisCount);
                    _a = 0, chosenDiagnosis_1 = chosenDiagnosis;
                    _d.label = 18;
                case 18:
                    if (!(_a < chosenDiagnosis_1.length)) return [3 /*break*/, 21];
                    diagnosisId = chosenDiagnosis_1[_a];
                    return [4 /*yield*/, prisma.prescriptionDiagnosis.create({
                            data: {
                                prescriptionId: prescriptionId,
                                diagnosisId: diagnosisId,
                                note: faker_1.faker.lorem.words(3),
                            }
                        })];
                case 19:
                    _d.sent();
                    _d.label = 20;
                case 20:
                    _a++;
                    return [3 /*break*/, 18];
                case 21:
                    _i++;
                    return [3 /*break*/, 17];
                case 22:
                    _b = 0, prescriptionIds_2 = prescriptionIds;
                    _d.label = 23;
                case 23:
                    if (!(_b < prescriptionIds_2.length)) return [3 /*break*/, 28];
                    prescriptionId = prescriptionIds_2[_b];
                    medicineCount = faker_1.faker.number.int({ min: 1, max: 4 });
                    chosenMedicine = faker_1.faker.helpers.arrayElements(medicineIds, medicineCount);
                    _c = 0, chosenMedicine_1 = chosenMedicine;
                    _d.label = 24;
                case 24:
                    if (!(_c < chosenMedicine_1.length)) return [3 /*break*/, 27];
                    medicineId = chosenMedicine_1[_c];
                    return [4 /*yield*/, prisma.prescriptionMedicine.create({
                            data: {
                                prescriptionId: prescriptionId,
                                medicineId: medicineId,
                                quantity: faker_1.faker.number.int({ min: 1, max: 10 }),
                                instruction: faker_1.faker.lorem.words(5)
                            }
                        })];
                case 25:
                    _d.sent();
                    _d.label = 26;
                case 26:
                    _c++;
                    return [3 /*break*/, 24];
                case 27:
                    _b++;
                    return [3 /*break*/, 23];
                case 28:
                    console.log("Đã seed xong dữ liệu mẫu!");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) { console.error(e); process.exit(1); })
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, prisma.$disconnect()];
        case 1:
            _a.sent();
            return [2 /*return*/];
    }
}); }); });
