import { useState } from 'react';
import { Card, Image, Text, Group, Badge, Progress, ActionIcon, Stack, AspectRatio } from '@mantine/core'; 
import { IconPencil, IconTrash } from '@tabler/icons-react'; 
import type { Juego }  from '../interfaces/Juego';
import type { Genre } from '../interfaces/Genre';
import FormularioJuego from './FormularioJuego';
import { calcularEstadoJuego } from '../utils/juegoUtils';

interface TarjetaJuegoProps {
  juego: Juego;
  listaGeneros: Genre[];
  onGuardar: (juegoEditado: Juego) => void;
  onEliminar: (id: number) => void;
}

function TarjetaJuego({ juego, listaGeneros, onGuardar, onEliminar }: TarjetaJuegoProps) {
  const [editando, setEditando] = useState(false);

  const handleGuardarEdicion = (juegoEditado: Juego) => {
    onGuardar(juegoEditado);
    setEditando(false);
  };

  const calcularProgreso = (jugadas: number, totales: number): number => {
    if (totales === 0) return 0;
    const porcentaje = (jugadas / totales) * 100;
    return Math.min(porcentaje, 100);
  };

  const progreso = calcularProgreso(juego.hours_played, juego.hours_total);
  const progresoRedondeado = Math.round(progreso);
  const estado = calcularEstadoJuego(juego.hours_played, juego.hours_total);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" className="glassmorphism">
      {editando ? (
        <FormularioJuego
          juegoInicial={juego}
          listaGeneros={listaGeneros}
          onGuardar={handleGuardarEdicion}
          onCancelar={() => setEditando(false)}
        />
      ) : (
        <>
        <Stack justify="space-between" h="100%">
          <Stack gap="xs" justify="flex-start">
            <Card.Section>
              <AspectRatio ratio={1/1}>
                <Image src={juego.image_url || null} alt={juego.title} radius="md" fallbackSrc="https://fallback.pics/api/v1/square/400?text=%F0%9F%8E%AE" />
              </AspectRatio>
            </Card.Section>
            
            <Group justify="flex-end">
              <Badge color={
                estado === 'Completado' ? 'green' : estado === 'Jugando' ? 'blue' : 'orange'
              }>
                {estado}
              </Badge>
            </Group>
            
            <Text fw={500}>{juego.title}</Text>
            
            <Text size="sm" c="dimmed"> 
              Has jugado {juego.hours_played} de {juego.hours_total} horas.
            </Text>

            <Text size="sm" c="dimmed">Progreso:</Text>

            <Progress.Root size="xl" radius="xl" mt="sm">
              <Progress.Section value={progreso} color={progresoRedondeado === 100 ? 'teal' : 'blue'}>
                {progresoRedondeado > 5 && (
                   <Progress.Label>{`${progresoRedondeado}%`}</Progress.Label>
                )}
              </Progress.Section>
            </Progress.Root>
          </Stack>

          <Group justify="flex-end" mt="md">
            <ActionIcon variant="light" color="blue" onClick={() => setEditando(true)} aria-label="Editar">
              <IconPencil size={18} />
            </ActionIcon>
            <ActionIcon variant="light" color="red" onClick={() => onEliminar(juego.id)} aria-label="Eliminar">
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
        </Stack>
        </>
      )}
    </Card>
  );
}

export default TarjetaJuego;