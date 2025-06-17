import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';

type Alarme = {
  id: number;
  horario: string;
};

export default function Alarmes() {
  const [horario, setHorario] = useState('');
  const [alarmes, setAlarmes] = useState<Alarme[]>([]);

  // 🔁 Coloque aqui o link gerado pelo seu ngrok
  const API_URL = 'https://0048-2804-14d-4487-10dc-455b-f937-be30-76c4.ngrok-free.app';

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

  // Adiciona um novo alarme
  const adicionarAlarme = async () => {
    if (!horario.trim()) return;

    try {
      await fetch(`${API_URL}/alarmes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horario }),
      });

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

  // Carrega a lista ao abrir a aba
  useEffect(() => {
    carregarAlarmes();
  }, []);

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
        ListEmptyComponent={<Text style={{ color: '#999' }}>Nenhum alarme cadastrado.</Text>}
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
