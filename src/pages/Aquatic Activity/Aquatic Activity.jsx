import { useEffect, useState } from "react";
import "./Aquatic Activity.css"
import { getActivityByType } from "../../services/apiCalls";
import { CustomActivity } from "../../common/CustomActivity/CustomActivity";
import { arrayBufferToBase64 } from "../../common/functions";
import { useNavigate } from "react-router";

export const Aquatic_Activities = () => {
    const navigate = useNavigate();
    const [typeActivities, setTypeActivities] = useState([]);

  useEffect(() => {
    if (typeActivities.length === 0) {
        const defaultType = 'acuatica';
        getActivityByType(defaultType)
        .then((results) => {
            console.log(results, "soy results")
          if (Array.isArray(results.data.data)) {
            const parseImage = results.data.data.map((activity) =>{
              return {
                imageBase64: arrayBufferToBase64(activity.image.data),
                ...activity
              }
            });
            setTypeActivities(parseImage);
          } else {
            console.error(
              "La respuesta de la API no tiene el formato esperado:"
            );
          }
        })
        .catch((error) => console.log(error));
    }
  }, [typeActivities]);

  const handleReserve = (activityId) => {
    try {
      console.log(activityId, "soy el activityId")
      if(activityId !== isNaN){
        navigate(`/infor_actividad`, { state: { activityId }});

      } 
  
    } catch (error) {
      console.error("Aquí quiero recuperar el error de la base de datos.", error);
    }
  };

return (
    <div className="activityDesign">
    {typeActivities.length > 0 ? (
      <div className="activityCard">
        {typeActivities.map((results) => {
          return (
            <CustomActivity
              key={results.id}
              image={results.imageBase64}
              title={results.title}
              description={results.description}
              price={results.price}
              handleReserve={handleReserve}
              id={results.id}
            />
          );
        })}
      </div>
    ) : (
      <div>Esperando las actividades</div>
    )}
  </div>
)}