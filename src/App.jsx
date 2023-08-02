import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Chart from 'react-google-charts'
import './App.css'


// Función para calcular el Índice de Masa Corporal (IMC)
const calculateIMC = (weight, height) => {
  const heightInMeters = height / 100; // Convertir altura de centímetros a metros
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(2); // Retornar el IMC con dos decimales
};

function App() {
  //                               mi estatura
  const [height, setHeight] = useState(163)
  

  const data = [
    //        Peso             Pecho              Cadera Gluteo                   Gemelos
    ["Date", "Weight", "IMC", "Chest", "Biceps", "Hip", "Buttock", "Quadriceps", "Twin"],
    ['Aug 1', 97.2   , parseFloat(calculateIMC(97.2, height)), 0, 0, 0, 0, 0, 0],
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

  return (
    <>
      <div>
        <a href="https://www.github.com/dimebruce" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Healthy Progress</h1>
      <h3>By dimebruce</h3>

      <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
    </>
  )
}

export default App
