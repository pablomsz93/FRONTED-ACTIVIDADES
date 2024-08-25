import axios from "axios";

const hostURL = "http://localhost:4000";


//Login
export const loginUser = async (body) => {
  return await axios.post(`${hostURL}/user`, body);
};

//Crear un nuevo usuario
export const createUser = async (body) => {
  return await axios.post(`${hostURL}/user/register`, body);
};

//Perfil: Recuperamos la información del usuario
export const profileUser = async (token) => {
  return await axios.get(`${hostURL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//Actualizar perfil
export const updateUser = async (token, body) => {
  return await axios.put(`${hostURL}/user`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//Recuperar todos los usuarios
export const getAllUsers = async (token) => {
  return await axios.get(`${hostURL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//Actualizar la contraseña
export const updatePassword = async (token, body) => {
  return await axios.patch(`${hostURL}/user/password`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//Inactivar la cuenta
export const deactivateAccount = async (token, body) => {
  return  await axios.put(`${hostURL}/user/account`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Acceder al perfil del usuario
export const loginSuper = async (token, body) => {
  return  await axios.post(`${hostURL}/user/login`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Todas las actividades
export const getAllActivities = async () => {
  // Conectamos la API a la base de datos
  return await axios.get (`${hostURL}/activity/all`);
}

// Todas las actividades por el type
export const getActivityByType = async (type) => {
  // Conectamos la API a la base de datos
  return await axios.get (`${hostURL}/activity/${type}`);
}

export const disponibilityDate = async ( body, token) => {
  return await axios.post(`${hostURL}/appointment/disponibility-activity`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Todas una actividad por el Id
export const getActivityById = async (id) => {
  console.log(id, "soy el id")
  // Conectamos la API a la base de datos
  return await axios.put (`${hostURL}/activity/${id}`);
}


export const getAppointmentByUser = async (token) => {
  return await axios.get(`${hostURL}/appointment`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createAppointment = async ( body, token) => {
  return await axios.post(`${hostURL}/appointment`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateAppointment = async ( body, token) => {
  return await axios.put(`${hostURL}/appointment`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllApointments = async (token) => {
  return await axios.get(`${hostURL}/appointment/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};