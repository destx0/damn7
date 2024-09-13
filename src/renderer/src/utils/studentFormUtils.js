export const formatLabel = (field, fieldLabels) => {
  return (
    fieldLabels[field] ||
    field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
  )
}

export const sanitizeValue = (id, value) => {
  if (['studentId', 'aadharNo', 'PENNo', 'GRN'].includes(id)) {
    let sanitizedValue = value.replace(/\D/g, '');
    if (id === 'PENNo') {
      return sanitizedValue.slice(0, 11);
    } else if (id === 'aadharNo') {
      return sanitizedValue.slice(0, 12);
    }
    return sanitizedValue;
  } else if (['name', 'surname', 'fathersName', 'mothersName'].includes(id)) {
    return value.replace(/[^a-zA-Z\s]/g, '');
  }
  return value;
}
