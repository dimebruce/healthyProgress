import Menu from "./components/Menu";
import User from "./components/User";
import "react-circular-progressbar/dist/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Asegúrate de importar tu base de datos

function App() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

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

      setUserData(sortedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <Menu fetchUserData={fetchUserData} />
      <User userData={userData} loading={loading} />
    </>
  );
}

export default App;
