import React from 'react';

export default class Project_Addition extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit_mode: false,
      project_addition: props.project_addition,
    }
  }

  switchEditMode(event) {
    if (this.state.edit_mode) {
      this.props.saveProjectAdditionChanges(this.state.project_addition, 'text_edit');
    }
    this.setState({edit_mode: !this.state.edit_mode});
  }

  titleChanged(event) {
    let project_addition = this.state.project_addition;
    project_addition.title = event.target.value;
    this.setState({project_addition});
  }

  descriptionChanged(event) {
    let project_addition = this.state.project_addition;
    project_addition.description = event.target.value;
    this.setState({project_addition});
  }

  deleteProjectAddition(event) {
    this.props.deleteProjectAddition(this.state.project_addition.id, 'delete project addition');
  }

  render() {

    let title = (
      <a role="button" data-toggle="collapse" href={"#project_addition" + this.state.project_addition.id}>
        Proposed Solution: {this.state.project_addition.title}
      </a>);
    let description = <span style={{width: "100%", whiteSpace: 'pre-wrap'}}>{this.state.project_addition.description}</span>;

    if (this.state.edit_mode) {
      title = <input onChange={this.titleChanged.bind(this)} type="text" style={{width: "75%"}} value={this.state.project_addition.title} />;
      description = <textarea onChange={this.descriptionChanged.bind(this)} style={{width: "100%"}} value={this.state.project_addition.description} />
    }

    let edit_button = (<button type="button" className="btn btn-primary pull-right" onClick={this.switchEditMode.bind(this)}>Edit</button>);
    let save_button = (<button type="button" className="btn btn-success pull-left" onClick={this.switchEditMode.bind(this)}>Save</button>);
    let delete_button = (<button type="button" className="btn btn-danger pull-right" onClick={this.deleteProjectAddition.bind(this)}>Delete</button>);

    return (
      <div className="panel panel-default">
        <div className="panel-heading clearfix" style={{backgroundImage: 'linear-gradient(to bottom,#dff0d8 0,#dff0d8 100%)', borderColor: '#d6e9c6'}} role="tab">
          <h4 className="panel-title" style={{color: '#3c763d'}}>
            {title}
            <a role="button" data-toggle="collapse" href={"#project_addition" + this.state.project_addition.id} className="glyphicon glyphicon-menu-down pull-right"></a>
          </h4>
        </div>
        <div id={"project_addition" + this.state.project_addition.id} className="panel-collapse collapse" role="tabpanel">
          <div className="panel-body clearfix">
            <div>
              {description}
            </div>
            {this.state.edit_mode ? delete_button : null}
            {this.state.edit_mode ? save_button : edit_button}
          </div>
        </div>
      </div>             
    );
  }
}