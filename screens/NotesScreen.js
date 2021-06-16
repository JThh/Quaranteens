import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {API, graphqlOperation} from 'aws-amplify'
import {listTodos} from '../src/graphql/queries'

export default function NotesScreen({navigation, route}) {
  const [todos, setTodos] = useState([])

  // This is to set up the top right button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => {
          navigation.navigate('Add Diary Entry');
        }}>
          <Ionicons
            name="ios-create-outline"
            size={30}
            color="black"
            style={{
              color: '#f55',
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    fetchTodos()
  })

  // Fetching the items from Todo Table's database
  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) {console.log('error fetching todos')}
  }


  // The function to render each row in our FlatList
  function renderItem({item}) {
    return (
        <View
          style={styles.flatList}>
          <Text
            style={styles.diaryTitle}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text numberOfLines={2}>
            {item.description}
          </Text>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={todos}
        renderItem={renderItem}
        style={{width: '90%'}}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatList: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  diaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10,
  }
});
