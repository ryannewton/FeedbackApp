import React from 'react';

export default class ProjectAddition extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      projectAddition: props.projectAddition,
    };

    this.titleChanged = this.titleChanged.bind(this);
    this.descriptionChanged = this.descriptionChanged.bind(this);
    this.switchEditMode = this.switchEditMode.bind(this);
    this.deleteProjectAddition = this.deleteProjectAddition.bind(this);
    this.approveProjectAddition = this.approveProjectAddition.bind(this);
  }

  switchEditMode() {
    if (this.state.editMode) {
      this.props.saveProjectAdditionChanges(this.state.projectAddition, 'text_edit');
    }
    this.setState({ editMode: !this.state.editMode });
  }

  titleChanged(event) {
    const projectAddition = this.state.projectAddition;
    projectAddition.title = event.target.value;
    this.setState({ projectAddition });
  }

  descriptionChanged(event) {
    const projectAddition = this.state.projectAddition;
    projectAddition.description = event.target.value;
    this.setState({ projectAddition });
  }

  deleteProjectAddition() {
    this.props.deleteProjectAddition(this.state.projectAddition.id, 'delete project addition');
  }

  approveProjectAddition() {
    const projectAddition = this.state.projectAddition;
    projectAddition.approved = 1;
    this.setState({ projectAddition });
    this.props.saveProjectAdditionChanges(projectAddition, 'approve project addition');
  }

  render() {
    let title = (
      <a role="button" data-toggle="collapse" href={'#projectAddition' + this.state.projectAddition.id}>
        Proposed Solution: {this.state.projectAddition.title}
      </a>);
    let description = <span style={{ width: '100%', whiteSpace: 'pre-wrap' }}>{this.state.projectAddition.description}</span>;

    if (this.state.editMode) {
      title = <input onChange={this.titleChanged} type="text" style={{ width: '75%' }} value={this.state.projectAddition.title} />;
      description = <textarea onChange={this.descriptionChanged} style={{ width: '100%' }} value={this.state.projectAddition.description} />;
    }

    const editButton = (
      <button
        type="button"
        className="btn btn-primary pull-right"
        onClick={this.switchEditMode}
      >
        Edit
      </button>);
    const saveButton = (
      <button
        type="button"
        className="btn btn-success pull-left"
        onClick={this.switchEditMode}
      >
        Save
      </button>);

    const deleteButton = (
      <button
        type="button"
        className="btn btn-danger pull-right"
        onClick={this.deleteProjectAddition}
      >
        Delete
      </button>);

    const approveButton = (
      <button
        type="button"
        className="btn btn-success btn-sm pull-right"
        onClick={this.approveProjectAddition}
      >
        Approve
      </button>);

    return (
      <div className="panel panel-default">
        <div className="panel-heading clearfix" style={{ backgroundImage: 'linear-gradient(to bottom,#dff0d8 0,#dff0d8 100%)', borderColor: '#d6e9c6' }} role="tab">
          <h4 className="panel-title" style={{ color: '#3c763d' }}>
            {title}
            {console.log(this.props.projectAddition.approved)}            
            <a role="button" data-toggle="collapse" href={'#projectAddition' + this.state.projectAddition.id} className="glyphicon glyphicon-menu-down pull-right" />
            {!this.props.projectAddition.approved ? approveButton : null}
          </h4>
        </div>
        <div id={'projectAddition' + this.state.projectAddition.id} className='panel-collapse collapse' role='tabpanel'>
          <div className="panel-body clearfix">
            <div>
              {description}
            </div>
            {this.state.editMode ? deleteButton : null}
            {this.state.editMode ? saveButton : editButton}
          </div>
        </div>
      </div>
    );
  }
}
