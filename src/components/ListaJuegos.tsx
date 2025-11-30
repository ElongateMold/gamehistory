import { SimpleGrid, Title, Stack } from '@mantine/core';
import type { Juego } from '../interfaces/Juego';
import type { Genre } from '../interfaces/Genre';
import TarjetaJuego from './TarjetaJuego';
import { calcularEstadoJuego } from '../utils/juegoUtils';

interface ListaJuegosProps {
  juegos: Juego[];
  listaGeneros: Genre[]; // Nuevo prop
  onGuardar: (juegoEditado: Juego) => void;
  onEliminar: (id: number) => void;
}

type JuegosAgrupados = {
  Completado: Juego[];
  Jugando: Juego[];
  Pendiente: Juego[];
};

function ListaJuegos({ juegos, listaGeneros, onGuardar, onEliminar }: ListaJuegosProps) {
  const juegosPorEstado = juegos.reduce<JuegosAgrupados>(
    (acc, juego) => {
      const estado = calcularEstadoJuego(juego.hours_played, juego.hours_total);
      acc[estado].push(juego);
      return acc;
    },
    { Completado: [], Jugando: [], Pendiente: [] }
  );
  
  const ordenDeEstados: (keyof JuegosAgrupados)[] = ['Jugando', 'Pendiente', 'Completado'];

  return (
    <Stack gap="xl">
      {ordenDeEstados.map((estado) => {
        const listaDeJuegos = juegosPorEstado[estado];
        if (listaDeJuegos.length === 0) return null;

        return (
          <div key={estado}>
            <Title order={2} mb="md">{estado}</Title>
            
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
              {listaDeJuegos.map((juego) => (
                <TarjetaJuego
                  key={juego.id}
                  juego={juego}
                  listaGeneros={listaGeneros}
                  onGuardar={onGuardar}
                  onEliminar={onEliminar}
                />
              ))}
            </SimpleGrid>
          </div>
        );
      })}
    </Stack>
  );
}

export default ListaJuegos;