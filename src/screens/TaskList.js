import React, { Component } from 'react'
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Platform,
    Alert
} from 'react-native'
// import AsyncStorage from "@react-native-community/async-storage"
import Icon from 'react-native-vector-icons/FontAwesome';
// import axios from 'axios'

import commonStyles from '../commonStyles'
import todayImage from '../../assets/imgs/today.jpg'; 
import Task from '../components/Task'
import AddTask from './AddTask';

export default class TaskList extends React.Component {
  state = {
    showDoneTasks: true,
    visibleTasks: [],
    showAddTask: false,
    tasks: [{
      id: Math.random(),
      desc: 'Comprar Livro de React Native',
      estimateAt:new Date(),
      doneAt: new Date(),
    }, {
      id: Math.random(),
      desc: 'Ler Livro de React Native',
      estimateAt:new Date(),
      doneAt: null,
    }]
  }

  componentDidMount = () => {
    this.filterTasks()
  }

  toggleFilter = () => {
    this.setState({ showDoneTasks:!this.state.showDoneTasks }, this.filterTasks)
  }

  filterTasks = () =>{
    let visibleTasks = null
    if(this.state.showDoneTasks){
      visibleTasks =  [...this.state.tasks]
    } else {
      const pending = task => task.doneAt === null 
      visibleTasks = this.state.tasks.filter(pending)
    }
    this.setState({ visibleTasks })
  }

  toggleTask = taskId => {
    const tasks = [...this.state.tasks]
    tasks.forEach(task => {
      if(task.id === taskId) {
        task.doneAt = task.doneAt ? null : new Date()
      }
    })
    this.setState({tasks}, this.filterTasks)
}

    addTask = newTask => {
        if(!newTask.desc || !newTask.desc.trim()){
          Alert.alert('Dados Invalidos', 'Descrição não informada!')
          return 
        }

        const tasks = [...this.state.tasks]
        tasks.push({
          id: Math.random(),
          desc: newTask.desc, 
          estimateAt: newTask.date,
          doneAt: null 
        })

        this.setState({ tasks, showAddTask: false}, this.filterTasks)
    }

    deleteTask = id => {
      const tasks = this.state.tasks.filter(task => task.id !== id)
      this.setState({ tasks }, this.filterTasks)
    }

  render() {
    return (
        <View style={styles.container}>
          <AddTask isVisible={this.state.showAddTask} onCancel={() => this.setState({ showAddTask: false })} onSave={this.addTask}/>
          <ImageBackground source={todayImage} style={styles.background}>
            <View style={styles.iconBar}>
              <TouchableOpacity onPress={this.toggleFilter}>
              <Icon name={this.state.showDoneTask ? 'eye' : 'eye-slash'} size={20} color={commonStyles.colors.secundary}/>
              </TouchableOpacity>
            </View>
            <View style={styles.titleBar}>
              <Text style={styles.title}>Hoje</Text>
              <Text style={styles.subtitle}>Sex. 3 de Janeiro</Text>
            </View>
          </ImageBackground>
          <View style={styles.taskList}>
           <FlatList data={this.state.visibleTasks}
           keyExtractor={item => `${item.id}`}
           renderItem={({item}) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask} />} />
           
          </View>
          <TouchableOpacity style={styles.addButton}
          activeOpacity={0.7}
          onPress={() => this.setState({showAddTask: true})}>
            <Icon name="plus" size={20} color={commonStyles.colors.secundary}/>
          </TouchableOpacity>
        </View>
    )
  }
}

const styles = StyleSheet.create({
container: {
  flex: 1 
},
background: {
  flex: 3 
}, 
taskList: {
  flex: 7
},
titleBar: {
  flex: 1,
  justifyContent: 'flex-end'
},
title: {
  fontFamily: commonStyles.fontFamily,
  color: commonStyles.colors.secondary,
  fontSize: 50,
  marginLeft: 20,
  marginBottom: 20
},
subtitle: {
  fontFamily: commonStyles.fontFamily,
  color: commonStyles.colors.secondary,
  fontSize: 20,
  marginLeft: 20,
  marginBottom: 30
},
iconBar: {
  flexDirection: 'row',
  marginHorizontal: 20,
  justifyContent: 'flex-end',
  marginTop: Platform.OS === 'ios' ? 40 : 10
},
addButton: {
  position: 'absolute',
  right: 30,
  bottom: 30,
  width: 50,
  height: 50,
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: commonStyles.colors.today
}
});