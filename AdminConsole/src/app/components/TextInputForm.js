import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';

class TextInputForm extends Component {
  state = {
    text: '',
  };
  render() {

    const {
      buttonColor,
      buttonText,
      submitFunction,
      onClose,
      instructionText,
      placeholderText,
      feedback,
    } = this.props;

    return (
      <div style={{ flexDirection: 'row', marginTop: 50  }}>
        <div className="col-md-9" style={{ marginTop: 10 }} >
          <FormGroup controlId="formControlsTextarea">
            <ControlLabel>{instructionText}</ControlLabel>
            <FormControl
              componentClass="textarea"
              placeholder={placeholderText}
              onChange={event => this.setState({ text: event.target.value })}
            />
          </FormGroup>
        </div>
        <div className="col-md-2" style={{ marginTop: 30 }} > 
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              submitFunction({ feedback, message: this.state.text });
              onClose();
            }}
            style={{ backgroundColor: buttonColor }}
          >
            {buttonText}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onClose}
            style={{ backgroundColor: '#00A2FF', marginTop: 7 }}
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }
}

const buttonStyles = {
  marginLeft: 20,
  marginRight: 20,
  width: 100,
  height: 30,
  color: 'white',
  border: 'none',
  borderRadius: 2,
  fontSize: 10,
};

TextInputForm.propTypes = {
  buttonColor: PropTypes.string,
  buttonText: PropTypes.string,
  inputValue: PropTypes.string,
  submitFunction: PropTypes.func,
  instructionText: PropTypes.string,
  placeholderText: PropTypes.string,
  feedback: PropTypes.object,
  closeFunction: PropTypes.func,
};

export default TextInputForm;
