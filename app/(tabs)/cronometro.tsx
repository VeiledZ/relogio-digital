import React, { useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Cronometro() {
  const [tempo, setTempo] = useState(0); // tempo em milissegundos
  const [ativo, setAtivo] = useState(false);
  const intervalo = useRef<ReturnType<typeof setInterval> | null>(null);

  const iniciar = () => {
    if (!ativo) {
      setAtivo(true);
      intervalo.current = setInterval(() => {
        setTempo((t) => t + 10); // aumenta 10ms
      }, 10);
    }
  };

  const pausar = () => {
    if (intervalo.current) {
      clearInterval(intervalo.current);
      intervalo.current = null;
      setAtivo(false);
    }
  };

  const zerar = () => {
    pausar();
    setTempo(0);
  };

  const formatar = (ms: number) => {
    const horas = String(Math.floor(ms / 3600000)).padStart(2, '0');
    const minutos = String(Math.floor(ms / 60000)).padStart(2, '0');
    const segundos = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    const milesimos = String(ms % 1000).padStart(2, '0');
    return `${horas}:${minutos}:${segundos}:${milesimos}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tempo}>{formatar(tempo)}</Text>
      <View style={styles.botoes}>
        <Button title={ativo ? 'Pausar' : 'Iniciar'} onPress={ativo ? pausar : iniciar} />
        <Button title="Zerar" onPress={zerar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
  },
  tempo: {
    fontSize: 70,
    color: '#fff',
    fontWeight: 'bold',
  },
  botoes: {
    flexDirection: 'row',
    gap: 20,
  },
});
