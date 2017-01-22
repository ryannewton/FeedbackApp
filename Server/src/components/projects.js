//import libraries
import React from 'react';

//import components
import Project from './project.js';

export default class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      department: "All Departments",
    }
    this.filter_by_department = this.filter_by_department.bind(this);
    this.department_changed = this.department_changed.bind(this);
    this.filter_by_stage = this.filter_by_stage.bind(this);
  }

  addProject() {
    this.props.addProject(this.props.receivedIDForAddProject);
  }

  compareNumbers(a, b) {
    return b.votes - a.votes;
  }

  department_changed(event) {
    event.preventDefault();
    this.setState({department: event.target.text});
  }

  filter_by_department(project) {
    if (this.state.department === "All Departments") {
      return true;
    } else {
      return (this.state.department === project.department);
    }
  }

  filter_by_stage(project) {
    let target_stage = this.props.params.stage || 'new';
    return target_stage === project.stage;
  }

  render() {

    let Rows = this.props.projects.filter(this.filter_by_stage).filter(this.filter_by_department).sort(this.compareNumbers).map((project, index, array) => {
      return <Project project={project} key={project.id} removeUpVote={this.props.removeUpVote} addUpVote={this.props.addUpVote} upVotes={this.props.up_votes} deleteProject={this.props.deleteProject.bind(this)} saveProjectChanges={this.props.saveProjectChanges.bind(this)} />
    });

    return (
      <div>
        <div id="rank_header">
          <span className="h4">{this.state.department}</span>
          <div className="dropdown pull-right">
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              Filter by Department
              <span className="caret"></span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
              <li><a href="#" onClick={this.department_changed}>All Departments</a></li>
              <li><a href="#" onClick={this.department_changed}>Housing</a></li>
              <li><a href="#" onClick={this.department_changed}>Dining</a></li>
              <li><a href="#" onClick={this.department_changed}>Academic Operations</a></li>
              <li><a href="#" onClick={this.department_changed}>Facilities</a></li>
              <li><a href="#" onClick={this.department_changed}>Other</a></li>
            </ul>
          </div>
        </div>
        <div>
          {Rows}
        </div>
        <button type="button" className="btn btn-success" onClick={this.addProject.bind(this)}>Add Project</button>
      </div>
    );
  }
}