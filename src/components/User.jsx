import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // Importa la base de datos
import { Chart } from 'react-google-charts'; // Importar el componente Chart de react-google-charts
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Importar estilos de CircularProgressbar

const User = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [goalWeight] = useState(90); // Definir una meta de peso aquí

  // Obtener todos los datos de usuario de Firestore en tiempo real
  const fetchUserData = () => {
    const unsubscribe = onSnapshot(collection(db, "userData"), (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date ? new Date(doc.data().date.seconds * 1000) : "",
      }));

      // Ordenar los datos por fecha
      const sortedData = data.sort((a, b) => a.date - b.date);
      setUserData(sortedData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user data:", error);
    });

    // Cleanup: Dejar de escuchar los cambios cuando el componente se desmonta
    return () => unsubscribe();
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Calcular la pérdida de peso histórica (peso inicial - peso actual)
  const calculateHistoricalWeightLost = () => {
    if (userData.length > 1) {
      const initialWeight = userData[0].weight;
      const currentWeight = userData[userData.length - 1].weight;
      const weightLost = initialWeight - currentWeight;

      const emoji = weightLost > 0 ? "😊" : "😠";
      const color = weightLost > 0 ? "green" : "red";

      return (
        <span style={{ color }}>
          {weightLost.toFixed(2)} kg {emoji}
        </span>
      );
    }
    return <span>0 kg 😊</span>;
  };

  // Calcular la pérdida de peso del último registro (último peso - penúltimo peso)
  const calculateWeightLostLastRecord = () => {
    if (userData.length > 1) {
      const lastWeight = userData[userData.length - 1].weight;
      const secondLastWeight = userData[userData.length - 2].weight;
      const weightLost = secondLastWeight - lastWeight;

      const emoji = weightLost > 0 ? "😊" : "😠";
      const color = weightLost > 0 ? "green" : "red";

      return (
        <span style={{ color }}>
          {weightLost.toFixed(2)} kg {emoji}
        </span>
      );
    }
    return <span>0 kg 😊</span>;
  };

  // Calcular el porcentaje de progreso hacia la meta
  const calculatePercentageToGoal = () => {
    if (userData.length > 0) {
      const currentWeight = userData[userData.length - 1].weight;
      const initialWeight = userData[0].weight;

      const weightLost = initialWeight - currentWeight;
      const totalToLose = initialWeight - goalWeight;

      const progress = (weightLost / totalToLose) * 100;
      return Math.max(0, Math.min(progress, 100)); // Limitar el valor entre 0% y 100%
    }
    return 0; // Si no hay datos
  };

  // Determinar el color de la barra de progreso
  const getProgressBarColor = () => {
    const percentage = calculatePercentageToGoal();
    if (percentage === 0) {
      return "#dc3545"; // Rojo si el progreso es 0
    } else if (percentage > 0 && percentage < 50) {
      return "#ffc107"; // Amarillo si el progreso es bajo (<50%)
    } else {
      return "#3366cc"; // Azul si el progreso es adecuado (>50%)
    }
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  // Preparar los datos para el gráfico
  const chartData = userData.map((user) => [user.date.toLocaleDateString(), user.weight]);
  const formattedChartData = [["Date", "Weight"], ...chartData];

  return (
    <div>
      <h2>Progreso de Peso</h2>

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
              textColor: getProgressBarColor(), // Cambiar color de texto según el progreso
              pathColor: getProgressBarColor(), // Cambiar color de barra según el progreso
              textSize: "13px",
            })}
          />
        </div>
      </div>

      {/* Mostrar las estadísticas */}
      <div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            Historical Lost Weight: {calculateHistoricalWeightLost()}
          </li>
          <li className="list-group-item">
            Last Lost Weight: {calculateWeightLostLastRecord()}
          </li>
          <li className="list-group-item">
            Goal: <span className="text-primary">{goalWeight} kg</span>
          </li>
        </ul>
      </div>

      {/* Gráfico de progreso de peso */}
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={formattedChartData}
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
            actions: ['dragToZoom', 'rightClickToReset'],
          },
          colors: ['#3366cc'], // Azul para el gráfico
        }}
      />
    </div>
  );
};

export default User;
