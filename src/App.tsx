import { useState, useEffect } from 'react';
import axios from 'axios'; // Importamos Axios
import { Container, Title, Text, Button, Group, Modal, Stack, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { Juego } from './interfaces/Juego';
import type { Genre } from './interfaces/Genre'; // Importamos Genre también
import ListaJuegos from './components/ListaJuegos';
import FormularioJuego from './components/FormularioJuego';
import TarjetaHoras from './components/TarjetaHoras';
import ThemeSwitcher from './components/ThemeSwitcher';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Objeto plantilla actualizado
const JUEGO_VACIO: Juego = {
  id: 0, 
  title: '',
  image_url: '',
  hours_played: 0,
  hours_total: 0,
  genres: [],
};

function App() {
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [generosDisponibles, setGenerosDisponibles] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  // 1. CARGAR DATOS DESDE API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [gamesRes, genresRes] = await Promise.all([
          axios.get(`${API_URL}/games`),
          axios.get(`${API_URL}/genres`)
        ]);
        setJuegos(gamesRes.data);
        setGenerosDisponibles(genresRes.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGuardarJuego = async (juegoParaGuardar: Juego) => {
    try {
      setLoading(true);
      
      const payload = {
        ...juegoParaGuardar,
        image_url: juegoParaGuardar.image_url === '' ? null : juegoParaGuardar.image_url,

        genres: (juegoParaGuardar.genres || []).map((g: any) => g.id ?? g)
      };

      if (juegoParaGuardar.id === 0) {
        // CREAR
        const response = await axios.post(`${API_URL}/games`, payload);
        setJuegos((prev) => [...prev, response.data]);
      } else {
        // ACTUALIZAR
        const response = await axios.put(`${API_URL}/games/${juegoParaGuardar.id}`, payload);
        setJuegos((prev) =>
          prev.map((j) => (j.id === response.data.id ? response.data : j))
        );
      }
      close();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el juego.");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarJuego = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar?")) return;
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/games/${id}`);
      setJuegos((prev) => prev.filter((juego) => juego.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal 
        opened={opened} 
        onClose={close} 
        title="Añadir Nuevo Juego" 
        centered
        classNames={{ content: 'glassmorphism' }}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <FormularioJuego
          juegoInicial={JUEGO_VACIO}
          listaGeneros={generosDisponibles} // Pasamos los géneros
          onGuardar={handleGuardarJuego}
          onCancelar={close}
        />
      </Modal>

      <Container my="md" pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        
        <Stack>
          <Title order={1} className="title-outline">GameHistory</Title>
          <Text>Gestiona tu colección de juegos y tu progreso.</Text>
        </Stack>
        
        <Group mb="xl" mt="xl" align="flex-start">
          <TarjetaHoras juegos={juegos} />
          
          <div style={{ marginTop: 'var(--mantine-spacing-xl)', width: '100%' }}>
            <ListaJuegos
              juegos={juegos}
              listaGeneros={generosDisponibles} // Pasamos los géneros
              onGuardar={handleGuardarJuego}
              onEliminar={handleEliminarJuego}
            />
          </div>
          
          <Group>
            <Button onClick={open}>Añadir Nuevo Juego</Button>
            <ThemeSwitcher />
          </Group>
        </Group>
      </Container>
    </>
  );
}

export default App;