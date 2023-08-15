import { useState } from "react";
import reactLogo from "./assets/react.svg";
import Menu from "./components/Menu";
import Chart from "react-google-charts";
import "react-circular-progressbar/dist/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Función para calcular el Índice de Masa Corporal (IMC)
const calculateIMC = (weight, height) => {
  const heightInMeters = height / 100; // Convertir altura de centímetros a metros
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(2); // Retornar el IMC con dos decimales
};

function App() {
  // mi estatura
  const [height, setHeight] = useState(163);

  const data = [
    ["Date", "Weight", "IMC", "Chest", "Biceps", "Hip", "Buttock", "Quadriceps", "Twin"],
    ['Aug 1', 97.2   , parseFloat(calculateIMC(97.2, height)), 114.1, 42, 110, 112, 67, 44],
    ['Aug 4', 95.25   , parseFloat(calculateIMC(95.25, height)), 113, 41, 106, 110, 65.4, 43],
    ['Aug 11', 94.85   , parseFloat(calculateIMC(94.85, height)), 111, 41, 105, 111, 64, 42.1],
  ];
  
  
  const options = {
    hAxis: {
      title: "Time",
    },
    vAxis: {
      title: "Data",
    },
    legend: { position: "bottom" },
  };

// Historical Weight Lost
const calculateHistoricalWeightLost = () => {
  if (data.length === 0) return 0;

  const firstWeight = data[1][1]; // Acceso a la fila 1, columna 1 (Weight)
  const lastWeight = data[data.length - 1][1]; // Acceso a la última fila, columna 1 (Weight)

  return firstWeight - lastWeight;
};

// The last weight lost
const calculateWeightLostLastRecord = () => {
  if (data.length < 3) return 0;

  const lastWeight = data[data.length - 1][1]; // Acceso a la última fila, columna 1 (Weight)
  const prevWeight = data[data.length - 2][1]; // Acceso a la penúltima fila, columna 1 (Weight)

  return prevWeight - lastWeight;
};

// Función para calcular el porcentaje de avance hacia el peso ideal
const calculatePercentageToGoal = () => {
  if (data.length === 0) return 0;

  const currentWeight = data[data.length - 1][1]; // Peso actual (última fila, segunda columna)
  const goalWeight = 85; // Peso objetivo

  const initialWeight = data[1][1]; // Peso inicial (segunda fila, segunda columna)
  const weightLost = initialWeight - currentWeight;
  const weightToLose = initialWeight - goalWeight;

  const percentageToGoal = (weightToLose !== 0) ? ((weightLost / weightToLose) * 100) : 0;

  return percentageToGoal.toFixed(2); // Retornar el porcentaje con dos decimales
};

  return (
    <>
      <Menu />
      <div className="mt-5">
        <a href="https://www.github.com/dimebruce" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div>
        <h1>Healthy Progress</h1>
        <h3>By dimebruce</h3>
        <p>Peso perdido histórico: {calculateHistoricalWeightLost().toFixed(2)}</p>
        <p>Ultimo peso perdido: {calculateWeightLostLastRecord().toFixed(2)}</p>
        <p>Meta: {calculatePercentageToGoal()}</p>
      </div>
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </>
  );
}

export default App;
