import { useState } from "react";
import reactLogo from "./assets/react.svg";
import Menu from "./components/Menu";
import Chart from "react-google-charts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
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

  const weightTest = [
    ["Date", "Weight"],
    ["Aug 1", 97.2],
    ["Aug 4", 95.25],
    ["Aug 11", 94.85],
    ["Aug 19", 94.90],
  ];

  const data = [
    [
      "Date",
      "Weight",
      "IMC",
      "Chest",
      "Biceps",
      "Hip",
      "Buttock",
      "Quadriceps",
      "Twin",
    ],
    [
      "Aug 1",
      97.2,
      parseFloat(calculateIMC(97.2, height)),
      114.1,
      42,
      110,
      112,
      67,
      44,
    ],
    [
      "Aug 4",
      95.25,
      parseFloat(calculateIMC(95.25, height)),
      113,
      41,
      106,
      110,
      65.4,
      43,
    ],
    [
      "Aug 11",
      94.85,
      parseFloat(calculateIMC(94.85, height)),
      111,
      41,
      105,
      111,
      64,
      42.1,
    ],
    [
      "Aug 19",
      94.90,
      parseFloat(calculateIMC(94.90, height)),
      111,
      41,
      106,
      113,
      62,
      43,
    ],
  ];

  const options = {
    title: "Weight Lost",
    curveType: "function",
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

    const percentageToGoal =
      weightToLose !== 0 ? (weightLost / weightToLose) * 100 : 0;

    return percentageToGoal.toFixed(2); // Retornar el porcentaje con dos decimales
  };

  return (
    <>
      <Menu />
      <div className="d-flex justify-content-center my-4">
        <div style={{ width: 160, height: 150 }}>
          <CircularProgressbar
            value={calculatePercentageToGoal()}
            text={`${calculatePercentageToGoal()}% goal`}
            circleRatio={0.75}
            styles={buildStyles({
              rotation: 1 / 2 + 1 / 8,
              trailColor: "#f8f9fa",
              backgroundColor: "#000",
              textColor: "#3366cc",
              pathColor: `#3366cc`,
              textSize: "13px",
            })}
          />
        </div>
      </div>
      <div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Historical Lost Weight: {calculateHistoricalWeightLost().toFixed(2)} kg</li>
          <li className="list-group-item">Last Lost Weight: {calculateWeightLostLastRecord().toFixed(2)} kg</li>
          <li className="list-group-item">Goal: 85 kg</li>
        </ul>
      </div>
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={weightTest}
        options={options}
      />
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
