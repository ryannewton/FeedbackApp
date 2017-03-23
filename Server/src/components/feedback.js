import React from 'react';
import Moment from 'moment';
import { DateRangePicker } from 'react-dates';

import FeedbackRow from './FeedbackRow';

export default class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
    };
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDatesChange({ startDate, endDate }) {
    this.props.updateDates(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  render() {
    const { focusedInput } = this.state;
    const { start_date, end_date } = this.props.main;
    const Rows = this.props.feedback.map((feedback, index) => {
      return <FeedbackRow key={index} feedback={feedback} addProject={this.props.addProject} receivedIDForAddProject={this.props.receivedIDForAddProject} department={'Other'} />;
    });
    return (
      <div>
        <DateRangePicker
          {...this.props}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={Moment(start_date)}
          endDate={Moment(end_date)}
          isOutsideRange={() => false}
        />
        <table>
          <thead>
            <tr>
              <th>Feedback</th>
              <th>Project_ID</th>
              <th>Add Project Button</th>
            </tr>
          </thead>
          <tbody>
            {Rows}
          </tbody>
        </table>
      </div>
    );
  }
}
