//import libraries
import React from 'react';

//import components
import Project from './project.js';

export default class Rank extends React.Component {
  constructor(props) {
    super(props);
  }

  addProject() {
    this.props.addProject(this.props.receivedIDForAddProject);
  }

  compareNumbers(a, b) {
    return b.votes - a.votes;
  }

  render() {

    let Rows = this.props.projects.sort(this.compareNumbers).map((project, index, array) => {
      return <Project project={project} key={project.id} removeUpVote={this.props.removeUpVote} addUpVote={this.props.addUpVote} upVotes={this.props.up_votes} deleteProject={this.props.deleteProject.bind(this)} saveProjectChanges={this.props.saveProjectChanges.bind(this)} />
    });

    return (
      <div>
        {Rows}
        <button type="button" className="btn btn-success" onClick={this.addProject.bind(this)}>Add Project</button>
      </div>
    );
  }
}