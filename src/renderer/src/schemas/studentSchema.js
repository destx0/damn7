import { z } from 'zod'

export const studentSchema = z.object({
  studentId: z.string().regex(/^\d{19}$/, { message: 'Student ID must be exactly 19 digits' }).optional(),
  aadharNo: z.string().regex(/^\d{12}$/, { message: 'Aadhar Number must be exactly 12 digits' }).optional(),
  PENNo: z.string().regex(/^\d{11}$/, { message: 'PEN Number must be exactly 11 digits' }).optional(),
  GRN: z.string().regex(/^\d+$/, { message: 'GRN must be numeric' }).min(1, { message: 'GRN is required' }),
  APAARId: z.string().regex(/^\d{12}$/, { message: 'APAAR ID/ABC ID must be exactly 12 digits' }).optional(),
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
    .optional(),
  religion: z.string().optional(),
  caste: z.string().optional(),
  subCaste: z.string().optional(),
  placeOfBirth: z.string().optional(),
  taluka: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  dateOfBirth: z.date({ required_error: 'Date of Birth is required' }),
  lastAttendedSchool: z.string().optional(),
  lastSchoolStandard: z.string().optional(),
  dateOfAdmission: z.date().optional(),
  admissionStandard: z.string().optional(),
  nationality: z.string().optional(),
  motherTongue: z.string().optional()
})
