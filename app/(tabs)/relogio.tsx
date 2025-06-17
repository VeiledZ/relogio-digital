import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Relogio() {
  const [horaAtual, setHoraAtual] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHoraAtual(new Date());
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const formatarHorario = (data: Date) => {
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.relogio}>{formatarHorario(horaAtual)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  relogio: {
    fontSize: 70,
    color: '#00ffcc',
    fontWeight: 'bold',
  },
});
