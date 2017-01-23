import React from 'react';

export default class Project extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="panel panel-default">
        <div className="panel-heading clearfix" style={{backgroundImage: 'linear-gradient(to bottom,#dff0d8 0,#dff0d8 100%)', borderColor: '#d6e9c6'}} role="tab">
          <h4 className="panel-title" style={{color: '#3c763d'}}>
            <a role="button" data-toggle="collapse" href={"#project_addition" + this.props.project_addition.id}>
              Proposed Solution: {this.props.project_addition.title}
            </a>
            <a role="button" data-toggle="collapse" href={"#project_addition" + this.props.project_addition.id} className="glyphicon glyphicon-menu-down pull-right"></a>
          </h4>
        </div>
        <div id={"project_addition" + this.props.project_addition.id} className="panel-collapse collapse" role="tabpanel">
          <div className="panel-body">
            {this.props.project_addition.description}
          </div>
        </div>
      </div>             
    );
  }
}