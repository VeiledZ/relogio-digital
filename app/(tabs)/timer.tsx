import React, { useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Timer() {
  const [minutosInput, setMinutosInput] = useState('0');
  const [segundosInput, setSegundosInput] = useState('0');
  const [tempoRestante, setTempoRestante] = useState(0);
  const [ativo, setAtivo] = useState(false);
  const intervalo = useRef<ReturnType<typeof setInterval> | null>(null);

  const iniciar = () => {
    const totalSegundos = parseInt(minutosInput) * 60 + parseInt(segundosInput);
    if (isNaN(totalSegundos) || totalSegundos <= 0) {
      Alert.alert('Tempo inválido');
      return;
    }

    setTempoRestante(totalSegundos);
    setAtivo(true);

    intervalo.current = setInterval(() => {
      setTempoRestante((tempo) => {
        if (tempo <= 1) {
          clearInterval(intervalo.current!);
          Alert.alert('⏰ Tempo finalizado!');
          setAtivo(false);
          return 0;
        }
        return tempo - 1;
      });
    }, 1000);
  };

  const pausar = () => {
    if (intervalo.current) {
      clearInterval(intervalo.current);
      setAtivo(false);
    }
  };

  const zerar = () => {
    pausar();
    setTempoRestante(0);
    setMinutosInput('0');
    setSegundosInput('0');
  };

  const formatar = (segundos: number) => {
    const min = String(Math.floor(segundos / 60)).padStart(2, '0');
    const sec = String(segundos % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <View style={styles.container}>
      {!ativo && (
        <View style={styles.inputs}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={minutosInput}
            onChangeText={setMinutosInput}
            placeholder="Min"
          />
          <Text style={{ color: 'white', fontSize: 30 }}>:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={segundosInput}
            onChangeText={setSegundosInput}
            placeholder="Seg"
          />
        </View>
      )}
      <Text style={styles.tempo}>{formatar(tempoRestante)}</Text>
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
    gap: 20,
  },
  tempo: {
    fontSize: 50,
    color: '#fff',
  },
  botoes: {
    flexDirection: 'row',
    gap: 20,
  },
  inputs: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 8,
    width: 60,
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 6,
  },
});
