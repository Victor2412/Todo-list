import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ActivityIndicator } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from './Colors';
import TodoList from './components/TodoList';
import AddListModal from './components/AddListModal';
import Fire from './Fire';

export default class App extends React.Component {
  state = {
    addTodoVisible: false,
    lists: [],
    user: {},
    loading: true,
  };

  componentDidMount() {
    this.firebase = new Fire((error, user) => {
      if (error) {
        alert("Uh oh, algo deu errado");
        return;
      }
      this.firebase.getLists(lists => {
        this.setState({ lists, user }, () => {
          this.setState({ loading: false });
        });
      });

      this.setState({ user });
    });
  }

  componentWillUnmount() {
    this.firebase.detach();
  }

  toggleAddTodoModal() {
    this.setState({ addTodoVisible: !this.state.addTodoVisible });
  }

  renderList = (list) => {
    return (
      <TodoList 
        list={list} 
        updateList={this.updateList} 
        deleteList={this.deleteList}  // Passe a função aqui
      />
    );
  };

  addList = (list) => {
    this.firebase.addList({
      name: list.name,
      color: list.color,
      todos: []
    });
  };

  updateList = (list) => {
    this.firebase.updateList(list);
  };

  deleteList = list => {
    this.firebase.deleteList(list);
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          visible={this.state.addTodoVisible}
          onRequestClose={() => this.toggleAddTodoModal()}
        >
          <AddListModal closeModal={() => this.toggleAddTodoModal()} addList={this.addList} />
        </Modal>

        <View style={{ flexDirection: "row" }}>
          <View style={styles.divider} />
          <Text style={styles.title}>
            Todo
            <Text style={{ fontWeight: "300", color:colors.blue  } }>List</Text>
          </Text>
          <View style={styles.divider} />
        </View>

        <View style={{ marginVertical: 48 }}>
          <TouchableOpacity style={styles.addList} onPress={() => this.toggleAddTodoModal()}>
            <AntDesign name="plus" size={16} color={colors.blue} />
          </TouchableOpacity>
          <Text style={styles.add}>Adicionar Lista</Text>
        </View>

        <View style={{ height: 275, paddingLeft: 32 }}>
          <FlatList
            data={this.state.lists}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => this.renderList(item)}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    backgroundColor: colors.blue,
    height: 1,
    flex: 1,
    alignSelf: 'center',
  },
  title: {
    color: colors.black,
    fontSize: 38,
    fontWeight: '800',
    paddingHorizontal: 64,
  },
  addList: {
    borderWidth: 2,
    borderColor: colors.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    color: colors.blue,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
});
