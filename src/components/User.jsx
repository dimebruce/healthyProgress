import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Importa la base de datos
import { Chart } from 'react-google-charts'; // Import Chart component from react-google-charts
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Importar los estilos de CircularProgressbar

const User = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [goalWeight] = useState(80); // Definir una meta de peso aquí

  // Obtener todos los datos de usuario de Firestore y ordenarlos por fecha
  const fetchUserData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "userData"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date ? new Date(doc.data().date.seconds * 1000) : "",
      }));

      // Ordenar los datos por fecha de forma ascendente
      const sortedData = data.sort((a, b) => a.date - b.date);

      // Preparar los datos para el gráfico
      const chartDataArray = sortedData.map((user) => [user.date.toLocaleDateString(), user.weight]);
      setChartData([["Date", "Weight"], ...chartDataArray]);

      setUserData(sortedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Calcular la pérdida total de peso (peso inicial - peso actual)
  const calculateHistoricalWeightLost = () => {
    if (userData.length > 1) {
      const initialWeight = userData[0].weight;
      const currentWeight = userData[userData.length - 1].weight;
      return initialWeight - currentWeight;
    }
    return 0;
  };

  // Calcular la pérdida de peso del último registro (último peso - penúltimo peso)
  const calculateWeightLostLastRecord = () => {
    if (userData.length > 1) {
      const lastWeight = userData[userData.length - 1].weight;
      const secondLastWeight = userData[userData.length - 2].weight;
      return secondLastWeight - lastWeight;
    }
    return 0;
  };

  // Calcular el porcentaje del progreso hacia la meta de peso
  const calculatePercentageToGoal = () => {
    if (userData.length > 0) {
      const currentWeight = userData[userData.length - 1].weight;
      const initialWeight = userData[0].weight;

      // Verificar si el peso inicial ya es menor o igual que la meta
      if (initialWeight <= goalWeight) {
        return 100; // Si el peso inicial es menor o igual a la meta, se considera como 100% de progreso
      }

      const weightLost = initialWeight - currentWeight;
      const totalToLose = initialWeight - goalWeight;

      // Si el usuario ya alcanzó o superó la meta, devolver 100%
      if (currentWeight <= goalWeight) {
        return 100;
      }

      // Evitar divisiones por 0 o valores negativos y retornar el porcentaje
      const progress = (weightLost / totalToLose) * 100;
      return Math.max(0, Math.min(progress, 100)); // Limitar el valor entre 0% y 100%
    }

    return 0; // Retornar 0% si no hay datos de usuario disponibles
  };

  // Determinar el color de la barra de progreso según el porcentaje
  const getProgressBarColor = () => {
    const percentage = calculatePercentageToGoal();
    if (percentage === 0) {
      return "#dc3545"; // Rojo para progreso negativo o 0
    } else if (percentage > 0 && percentage < 50) {
      return "#ffc107"; // Amarillo si el progreso es bajo (<50%)
    } else {
      return "#3366cc"; // Azul si el progreso es adecuado (>50%)
    }
  };

  // Función para calcular el color de un punto de datos
function getColor(weight, previousWeight) {
  return weight > previousWeight ? '#FF0000' : '#0000FF'; // Rojo si aumenta, azul si disminuye
}

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div>

      {/* Circular Progress Bar */}
      <div className="d-flex justify-content-center my-4">
        <div style={{ width: 160, height: 150 }}>
          <CircularProgressbar
            value={calculatePercentageToGoal()}
            text={`${calculatePercentageToGoal().toFixed(2)}% goal`}
            circleRatio={0.75}
            styles={buildStyles({
              rotation: 1 / 2 + 1 / 8,
              trailColor: "#f8f9fa",
              backgroundColor: "#000",
              textColor: getProgressBarColor(), // Cambiar el color del texto según el progreso
              pathColor: getProgressBarColor(), // Cambiar el color de la barra según el progreso
              textSize: "13px",
            })}
          />
        </div>
      </div>

      {/* Mostrar las estadísticas */}
      <div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            Historical Lost Weight:{" "}
            <span
              className={
                calculateHistoricalWeightLost() >= 0
                  ? "text-success"
                  : "text-danger"
              }
            >
              {calculateHistoricalWeightLost() >= 0 ? "👇😁 " : "☝️😡 "}
              {calculateHistoricalWeightLost().toFixed(2)} kg
            </span>
          </li>
          <li className="list-group-item">
            Last Lost Weight:{" "}
            <span
              className={
                calculateWeightLostLastRecord() >= 0
                  ? "text-success"
                  : "text-danger"
              }
            >
              {calculateWeightLostLastRecord() >= 0 ? "👇😁 " : "☝️😡 "}
              {calculateWeightLostLastRecord().toFixed(2)} kg
            </span>
          </li>
          <li className="list-group-item">
            Goal: <span className="text-primary">{goalWeight} kg</span>
          </li>
        </ul>
      </div>

      <Chart
  chartType="LineChart"
  width="100%"
  height="400px"
  data={chartData}
  options={{
    curveType: "function",
    title: "Progress",
    hAxis: {
      title: "Date",
      slantedText: true,
      slantedTextAngle: 45,
    },
    vAxis: { title: "Weight (kg)" },
    legend: { position: "bottom" },
    explorer: {
      axis: 'horizontal',
      actions: ['dragToZoom', 'rightClickToReset']
    },
    colors: ['#3366cc'] // Color rojo para la única serie de datos
  }}
/>
    </div>
  );
};

export default User;
