import { z } from 'zod'

// Helper function to create an optional string field with regex validation
const optionalStringWithRegex = (regex, errorMessage) =>
  z.string().regex(regex, { message: errorMessage }).optional().or(z.literal(''))

export const studentSchema = z.object({
  studentId: optionalStringWithRegex(/^\d{19}$/, 'Student ID must be exactly 19 digits'),
  aadharNo: optionalStringWithRegex(/^\d{12}$/, 'Aadhar Number must be exactly 12 digits'),
  PENNo: optionalStringWithRegex(/^\d{11}$/, 'PEN Number must be exactly 11 digits'),
  GRN: z.string().regex(/^\d+$/, { message: 'GRN must be numeric' }).min(1, { message: 'GRN is required' }),
  APAARId: optionalStringWithRegex(/^\d{12}$/, 'APAAR ID/ABC ID must be exactly 12 digits'),
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
  mothersName: optionalStringWithRegex(/^[a-zA-Z\s]*$/, "Mother's Name must contain only letters and spaces"),
  religion: z.string().optional().or(z.literal('')),
  caste: z.string().optional().or(z.literal('')),
  subCaste: z.string().optional().or(z.literal('')),
  placeOfBirth: z.string().optional().or(z.literal('')),
  taluka: z.string().optional().or(z.literal('')),
  district: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  dateOfBirth: z.date({ required_error: 'Date of Birth is required' }),
  lastAttendedSchool: z.string().optional().or(z.literal('')),
  lastSchoolStandard: z.string().optional().or(z.literal('')),
  dateOfAdmission: z.date().optional().or(z.literal('')),
  admissionStandard: z.string().optional().or(z.literal('')),
  nationality: z.string().optional().or(z.literal('')),
  motherTongue: z.string().optional().or(z.literal(''))
})
