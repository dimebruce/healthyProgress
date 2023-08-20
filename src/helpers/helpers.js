// Función para calcular el Índice de Masa Corporal (IMC)
export const calculateIMC = (weight, height) => {
    const heightInMeters = height / 100; // Convertir altura de centímetros a metros
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(2); // Retornar el IMC con dos decimales
  };