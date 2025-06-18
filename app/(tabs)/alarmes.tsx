import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button,
  FlatList, Alert, StyleSheet
} from 'react-native';
import * as Notifications from 'expo-notifications';

type Alarme = {
  _id: string;
  horario: string;
};

const API_URL = 'https://relogio-backend.onrender.com';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Alarmes() {
  const [horario, setHorario] = useState('');
  const [alarmes, setAlarmes] = useState<Alarme[]>([]);

  useEffect(() => {
    solicitarPermissao();
    carregarAlarmes();
  }, []);

  async function solicitarPermissao() {
    const { granted } = await Notifications.requestPermissionsAsync();
    if (!granted) Alert.alert('Permissão de notificação negada.');
  }

  async function carregarAlarmes() {
    try {
      const res = await fetch(`${API_URL}/alarmes`);
      const json = await res.json();
      setAlarmes(json);
    } catch {
      Alert.alert('Erro ao carregar alarmes');
    }
  }

  async function agendarNotificacao(horario: string) {
    const [hour, minute] = horario.split(':').map(Number);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Alarme',
        body: `Hora marcada: ${horario}`,
      },
      trigger: {
        type: 'calendar',
        hour,
        minute,
        repeats: false,
      },
    });
  }

  async function adicionarAlarme() {
    if (!horario.trim()) return;
    try {
      const res = await fetch(`${API_URL}/alarmes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horario }),
      });
      const novo = await res.json();
      await agendarNotificacao(novo.horario);
      setHorario('');
      carregarAlarmes();
    } catch {
      Alert.alert('Erro ao adicionar alarme');
    }
  }

  async function removerAlarme(id: string) {
    try {
      await fetch(`${API_URL}/alarmes/${id}`, { method: 'DELETE' });
      carregarAlarmes();
    } catch {
      Alert.alert('Erro ao remover alarme');
    }
  }

  async function testarNotificacao() {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Teste Rápido',
        body: 'Esta notificação chegou após 10 segundos?',
      },
      trigger: { seconds: 10, repeats: false },
    });
    console.log('⏱️ Notificação de teste agendada com ID:', id);
  }

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
      <View style={{ marginTop: 10 }}>
        <Button title="Testar Notificação em 10s" onPress={testarNotificacao} color="orange" />
      </View>
      <FlatList
        data={alarmes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.horario}>{item.horario}</Text>
            <Button title="Excluir" onPress={() => removerAlarme(item._id)} />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum alarme cadastrado.</Text>}
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', padding: 20 },
  titulo: { fontSize: 24, color: '#fff', marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 10,
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
  horario: { color: '#fff', fontSize: 18 },
  vazio: { color: '#999', textAlign: 'center', marginTop: 20 },
});
