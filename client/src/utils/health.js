export function calculateBmi(heightCm, weightKg) {
  const height = Number(heightCm) / 100;
  const weight = Number(weightKg);

  if (!height || !weight) {
    return null;
  }

  return (weight / (height * height)).toFixed(1);
}

export function getBmiLabel(bmi, age) {
  if (Number(age) < 20) {
    return 'BMI tham khảo';
  }

  const value = Number(bmi);

  if (value < 18.5) {
    return 'Thiếu cân';
  }

  if (value < 25) {
    return 'Bình thường';
  }

  if (value < 30) {
    return 'Thừa cân';
  }

  return 'Béo phì';
}
