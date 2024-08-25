import dayjs from "dayjs";

export const validator = (type, value) => {
  let error = "";

  switch (type) {
    // Validación del email
    case "email":
    case "correo":
    case "mail":
      if (value === undefined || value.trim() === "") {
        error = "Formato de email incorrecto.";
      }

      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
        error = "Formato de email incorrecto.";
      }
      break;

    // Validación del name y surname
    case "name":
    case "surname":
      if (
        value == undefined ||
        value.trim() == "" ||
        value.length < 4 ||
        value.length > 50
      ) {
        error = "Número máx. de caracteres 50.";
      }
      break;

    // Validación del teléfono
    case "phone":
    case "telefono":
      if (
        !/^\d+$/.test(value) ||
        value == undefined ||
        value < 600000000 ||
        value > 900000000
      ) {
        error = "Número de teléfono incorrecto.";
      }
      break;

    // Validación del teléfono
    case "participants":
      if (
        value == undefined ||
        value < 1 ||
        value > 12
      ) {
        error = "Selecciona de 1 a 12 participantes.";
      }
      break;

    // Validación del password
    case "password":
    case "passwordOld":
    case "contraseña":
      if (
        value == undefined ||
        value.trim() == "" ||
        value.length < 6 ||
        value.length > 12
      ) {
        error = "La contraseña debe contener de 6 a 12 caracteres";
      }
      break;

    // Validación de id
    case "profile_id":
      if (value !== undefined) {
        error = "Introduce un id válido";
      }
      break;

    // Validación de fecha
    case "date":
    case "date_activity":

       {
      const dateBody = dayjs(value, "'{AAAA} MM-DDTHH:mm:ss SSS [Z] A'");
      const dateNow = dayjs();

      if (!dateBody.isValid() || dateBody < dateNow) {
        error =
          "El formato de la fecha no es válido o es anterior a la creación de la cita. Es {AAAA} MM-DDTHH:mm:ss SSS [Z] A'";
      }

      if (!dateBody) {
        error = "La fecha y hora no puede ser nula.";
      }
      break;
    }

    // Validación de un boolean
    case "is_active":
    case "accept_requirements":
      if (value !== true && value !== false) {
        error = "El valor debe ser true o false.";
      }
      break;
  }

  return error;
};
