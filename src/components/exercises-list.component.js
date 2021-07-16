import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Exercise = props => (
  <tr>
    <td>{props.exercise.username}</td>
    <td>{props.exercise.description}</td>
    <td>{props.exercise.duration}</td>
    <td>{props.exercise.date.substring(0,10)}</td>
    <td>
      <Link to={"/edit/"+props.exercise._id}>edit</Link> | <a href="#" onClick={() => { props.deleteExercise(props.exercise._id) }}>delete</a>
    </td>
  </tr>
)

export default class ExercisesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        exercises: [],
        name:""
    };
  }

  componentDidMount() {
    axios.get('http://localhost:5000/exercises/')
      .then(response => {
        this.setState({ exercises: response.data })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  handleSearch = (e) => {
    this.setState({
        name:e.target.value
    })
  }

  handleSort = ()=>{
    this.state.exercises.sort(function(a, b){
        if(a.username < b.username) { return -1; }
        if(a.username > b.username) { return 1; }
        return 0;
    })
    this.setState({
        exercises:this.state.exercises
    })
  }

  deleteExercise = (id)=>{
    axios.delete('http://localhost:5000/exercises/'+id)
      .then(response => { console.log(response.data)});

    this.setState({
      exercises: this.state.exercises.filter(el => el._id !== id)
    })
  }

  exerciseList = ()=>{
      const {name,exercises} = this.state
      let newExercises = [];
      newExercises = name ? exercises.filter(function(item){
          if(item.username == name){
              return item;
          }
      }):exercises;
    return newExercises.map(currentexercise => {
      return <Exercise exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id}/>;
    })
  }

  render() {
    return (
      <div>
        <h3>Logged Exercises</h3>
        <input type="text" placeholder="serach by name" value={this.state.name} onChange={this.handleSearch}></input>
        <button onClick={this.handleSort}>sort by name</button>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Username</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { this.exerciseList() }
          </tbody>
        </table>
      </div>
    )
  }
}