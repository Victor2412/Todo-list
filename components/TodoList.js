import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Alert } from 'react-native';
import colors from './../Colors';
import TodoModal from './TodoModal';

export default class TodoList extends React.Component {
  state = {
    showListVisible: false
  }

  toggleListModal() {
    this.setState({
      showListVisible: !this.state.showListVisible
    });
  }

  handleLongPress = () => {
    Alert.alert(
      "Deletar Lista",
      "Tem certeza que deseja deletar esta lista?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Deletar",
          onPress: () => this.props.deleteList(this.props.list)
        }
      ],
      { cancelable: true }
    );
  }

  render() {
    const list = this.props.list;
    const completedCount = list.todos.filter(todo => todo.completed).length;
    const remainingCount = list.todos.length - completedCount;

    return (
      <View>
        <Modal 
          animationType='slide' 
          visible={this.state.showListVisible} 
          onRequestClose={() => this.toggleListModal()}
        >
          <TodoModal 
            list={list} 
            closeModal={() => this.toggleListModal()}
            updateList={this.props.updateList}
          />
        </Modal>
        <TouchableOpacity 
          style={[styles.listContainer, { backgroundColor: list.color }]} 
          onPress={() => this.toggleListModal()} 
          onLongPress={this.handleLongPress} // Utilize a função handleLongPress aqui
        >
          <Text style={styles.listTitle} numberOfLines={1}>
            {list.name}
          </Text>
          <View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.count}>{remainingCount}</Text>
              <Text style={styles.subtitle}>Restantes</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.count}>{completedCount}</Text>
              <Text style={styles.subtitle}>Completos</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 12,
    alignItems: "center",
    width: 200,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 18
  },
  count: {
    fontSize: 48,
    fontWeight: '200',
    color: colors.white,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  }
});
