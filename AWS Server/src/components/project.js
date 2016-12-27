import React from 'react';

export default class Project extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit_mode: false,
      project: this.props.project
    }
  }

  upVote(event) {
    let project = this.state.project;
    project.votes += 1;
    this.props.saveProjectChanges(project);
  }

  switchEditMode(event) {
    if (this.state.edit_mode) {
      this.props.saveProjectChanges(this.state.project);
    }
    this.setState({edit_mode: !this.state.edit_mode});
  }

  titleChanged(event) {
    let project = this.state.project;
    project.title = event.target.value;
    this.setState({project});
  }

  descriptionChanged(event) {
    let project = this.state.project;
    project.description = event.target.value;
    this.setState({project});
  }

  deleteProject(event) {
    this.props.deleteProject(this.state.project.id);
  }

  render() {

    let title = <h3 style={{width: "75%"}} className="panel-title">{this.state.project.title}</h3>;
    let description = <span style={{width: "100%"}}>{this.state.project.description}</span>;
    if (this.state.edit_mode) {
      title = <input onChange={this.titleChanged.bind(this)} type="text" style={{width: "75%"}} className="panel-title" value={this.state.project.title} />;
      description = <textarea onChange={this.descriptionChanged.bind(this)} style={{width: "100%"}} value={this.state.project.description} />
    }

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          {title}
          <button type="button" className="btn btn-default btn-project pull-right" onClick={this.upVote.bind(this)}>
            &nbsp;Up Vote!&nbsp;
            <span className="glyphicon glyphicon-thumbs-up"></span>&nbsp;
            <span className="numberCircle">{this.state.project.votes}</span>
          </button>
        </div>
        <div className="panel-body">
          {description}
          <a onClick={this.switchEditMode.bind(this)} className="pull-right link-edit">{this.state.edit_mode ? "Save" : "Edit"}</a>
          <a onClick={this.deleteProject.bind(this)} className="pull-right link-edit">{this.state.edit_mode ? "Delete" : ""}</a>
        </div>          
      </div>
    );
  }
}