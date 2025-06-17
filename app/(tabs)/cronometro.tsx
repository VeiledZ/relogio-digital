import React, { useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Cronometro() {
  const [tempo, setTempo] = useState(0);
  const [ativo, setAtivo] = useState(false);
  const intervalo = useRef<ReturnType<typeof setInterval> | null>(null);

  const iniciar = () => {
    if (!ativo) {
      setAtivo(true);
      intervalo.current = setInterval(() => {
        setTempo((t) => t + 1);
      }, 1000);
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

  const formatar = (segundos: number) => {
    const min = String(Math.floor(segundos / 60)).padStart(3, '0');
    const sec = String(segundos % 60).padStart(2, '0');
    return `${min}:${sec}`;
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
    fontSize: 60,
    color: '#fff',
    fontWeight: 'bold',
  },
  botoes: {
    flexDirection: 'row',
    gap: 20,
  },
});
