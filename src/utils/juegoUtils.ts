// Esta función toma las horas y devuelve el estado como un string.
export const calcularEstadoJuego = (
  horasJugadas: number,
  horasTotales: number
): 'Jugando' | 'Completado' | 'Pendiente' => {

  if (horasTotales > 0 && horasJugadas >= horasTotales) {
    return 'Completado';
  }

  if (horasJugadas > 0 && horasJugadas < horasTotales) {
    return 'Jugando';
  }

  return 'Pendiente';
};