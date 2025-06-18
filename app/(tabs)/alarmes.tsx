import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';

type Alarme = {
  id: number;
  horario: string;
};

export default function Alarmes() {
  const [horario, setHorario] = useState('');
  const [alarmes, setAlarmes] = useState<Alarme[]>([]);

  const API_URL = 'https://seu-app.onrender.com'; // ajuste para sua URL

  useEffect(() => {
    carregarAlarmes();
  }, []);

  // Carrega alarmes do backend
  const carregarAlarmes = async () => {
    try {
      const res = await fetch(`${API_URL}/alarmes`);
      const data = await res.json();
      setAlarmes(data);
    } catch (err) {
      Alert.alert('Erro ao carregar alarmes');
    }
  };

  // Agendar notificação local
  async function scheduleAlarmNotification(horario: string) {
    const [hour, minute] = horario.split(':').map(Number);
    const now = new Date();
    const triggerDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0
    );
    if (triggerDate <= now) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Alarme',
        body: `Hora marcada: ${horario}`,
      },
      trigger: triggerDate,
    });
  }

  // Adiciona um novo alarme
  const adicionarAlarme = async () => {
    if (!horario.trim()) return;

    try {
      const res = await fetch(`${API_URL}/alarmes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horario }),
      });

      const novo = await res.json();
      await scheduleAlarmNotification(novo.horario);

      setHorario('');
      carregarAlarmes();
    } catch (err) {
      Alert.alert('Erro ao adicionar alarme');
    }
  };

  // Remove alarme por ID
  const removerAlarme = async (id: number) => {
    try {
      await fetch(`${API_URL}/alarmes/${id}`, { method: 'DELETE' });
      carregarAlarmes();
    } catch (err) {
      Alert.alert('Erro ao remover alarme');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Alarmes</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: 07:30"
        value={horario}
        onChangeText={setHorario}
        keyboardType="numeric"
      />

      <Button title="Adicionar" onPress={adicionarAlarme} />

      <FlatList
        data={alarmes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.horario}>{item.horario}</Text>
            <Button title="Excluir" onPress={() => removerAlarme(item.id)} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#999' }}>Nenhum alarme cadastrado.</Text>
        }
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    fontSize: 18,
    marginBottom: 10,
    borderRadius: 6,
  },
  item: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horario: {
    color: '#fff',
    fontSize: 18,
  },
});
