import React, { useState } from 'react';
import { TextInput, NumberInput, Button, Group, Stack, Image, AspectRatio, MultiSelect } from '@mantine/core';
import type { Juego } from '../interfaces/Juego';
import type { Genre } from '../interfaces/Genre';

interface FormularioJuegoProps {
  juegoInicial: Juego; 
  listaGeneros: Genre[]; // Nuevo prop
  onGuardar: (juego: Juego) => void;
  onCancelar: () => void;
}

function FormularioJuego({ juegoInicial, listaGeneros, onGuardar, onCancelar }: FormularioJuegoProps) {
  const [formData, setFormData] = useState<Juego>(juegoInicial);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (valor: string) => {
    setFormData(prev => ({ ...prev, image_url: valor }));
  };

  const handleHorasChange = (valor: number | string) => {
    setFormData(prev => ({ ...prev, hours_played: Number(valor) }));
  };

  const handleHorasTotalesChange = (valor: number | string) => {
    setFormData(prev => ({ ...prev, hours_total: Number(valor) }));
  };

  // Lógica MultiSelect
  const handleGenresChange = (selectedIds: string[]) => {
    const nuevosGeneros = selectedIds.map(idStr => {
      return listaGeneros.find(g => g.id.toString() === idStr);
    }).filter(g => g !== undefined) as Genre[];

    setFormData(prev => ({ ...prev, genres: nuevosGeneros }));
  };

  // Opciones para Mantine
  const opcionesGeneros = listaGeneros.map(g => ({
    value: g.id.toString(),
    label: g.name
  }));
  
  const valoresSeleccionados = (formData.genres || []).map(g => g.id.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <AspectRatio ratio={16/9}>
          <Image
            radius="md"
            src={formData.image_url || null}
            alt={formData.title}
            fit="contain"
            fallbackSrc="https://placehold.co/400x300?text=Sin+Imagen"
          />
        </AspectRatio>
        
        <TextInput
          label="URL de la imagen"
          name="image_url"
          value={formData.image_url}
          onChange={(e) => handleImageChange(e.target.value)}
        />
        <TextInput
          label="Nombre del juego"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        
        <MultiSelect
            label="Géneros"
            placeholder="Selecciona géneros"
            data={opcionesGeneros}
            value={valoresSeleccionados}
            onChange={handleGenresChange}
            searchable
            hidePickedOptions
        />

        <NumberInput
          label="Horas jugadas"
          name="hours_played"
          value={formData.hours_played}
          onChange={handleHorasChange}
          min={0}
          required
        />
        <NumberInput
          label="Horas totales"
          name="hours_total"
          value={formData.hours_total}
          onChange={handleHorasTotalesChange}
          min={0}
          required
        />
        
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button type="submit">
            Guardar
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default FormularioJuego;