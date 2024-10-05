import { z } from 'zod'

export const studentSchema = z.object({
  studentId: z.string().regex(/^\d{19}$/, { message: 'Student ID must be exactly 19 digits' }),
  aadharNo: z.string().regex(/^\d{12}$/, { message: 'Aadhar Number must be exactly 12 digits' }),
  PENNo: z
    .string()
    .regex(/^\d{11}$/, { message: 'PEN Number must be exactly 11 digits' })
    .optional(),
  GRN: z.string().regex(/^\d+$/, { message: 'GRN must be numeric' }).optional(),
  name: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, { message: 'Name must contain only letters and spaces' })
    .min(1, { message: 'Name is required' }),
  fathersName: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, { message: "Father's Name must contain only letters and spaces" })
    .min(1, { message: "Father's Name is required" }),
  surname: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, { message: 'Surname must contain only letters and spaces' })
    .min(1, { message: 'Surname is required' }),
  mothersName: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, { message: "Mother's Name must contain only letters and spaces" })
    .min(1, { message: "Mother's Name is required" }),
  religion: z.string().min(1, { message: 'Religion is required' }),
  caste: z.string().optional(),
  subCaste: z.string().optional(),
  placeOfBirth: z.string().min(1, { message: 'Place of Birth is required' }),
  taluka: z.string().optional(),
  district: z.string().min(1, { message: 'District is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  dateOfBirth: z.date({ required_error: 'Date of Birth is required' }),
  lastAttendedSchool: z.string().optional(),
  lastSchoolStandard: z.string().optional(),
  dateOfAdmission: z.date({ required_error: 'Date of Admission is required' }),
  admissionStandard: z.string().min(1, { message: 'Admission Standard is required' }),
  nationality: z.string().min(1, { message: 'Nationality is required' }),
  motherTongue: z.string().min(1, { message: 'Mother Tongue is required' })
})
