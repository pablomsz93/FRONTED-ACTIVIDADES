
export const arrayBufferToBase64 =  ( buffer ) => {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    return binary;
  }

  export const dateFormat = (fechaString) => {
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', opciones);
  };

