import { Card, Text, Group, Stack } from '@mantine/core';
import { IconClock, IconCalendarStats } from '@tabler/icons-react';
import { useMemo } from 'react'; 
import type { Juego } from '../interfaces/Juego';

interface StatsCardProps {
  juegos: Juego[];
}

function TarjetaHoras({ juegos }: StatsCardProps) {
  const stats = useMemo(() => {
    // Variable actualizada: hours_played
    const totalHoras = juegos.reduce((total, juego) => total + juego.hours_played, 0);

    const hora_por_dia = 24;
    const totalDias = Math.floor(totalHoras / hora_por_dia);
    const horasRestantes = totalHoras % hora_por_dia;

    return {
      totalHoras,
      totalDias,
      horasRestantes,
    };
  }, [juegos]);

  return (
    <Card withBorder padding="lg" radius="md" className="glassmorphism">
      <Group justify="space-between" mb="xs">
        <Group>
          <IconClock size={32} color="var(--mantine-color-blue-5)" />
          <Stack gap={0} align="flex-start">
            <Text size="xl" fw={700}>
              {stats.totalHoras.toLocaleString()}
            </Text>
            <Text size="sm" c="dimmed">
              Horas Totales
            </Text>
          </Stack>
        </Group>

        <Group>
          <IconCalendarStats size={32} color="var(--mantine-color-teal-5)" />
          <Stack gap={0} align="flex-start">
            <Text size="xl" fw={700}>
              {stats.totalDias}d {stats.horasRestantes}h
            </Text>
            <Text size="sm" c="dimmed">
              Tiempo Total
            </Text>
          </Stack>
        </Group>
      </Group>
    </Card>
  );
}

export default TarjetaHoras;