/* eslint no-console:0 */
import React, {
  PropTypes,
  PureComponent
} from 'react';
import {
  AnimatedView,
} from '../../components';

class General extends PureComponent {
  static propTypes= {
    actions: PropTypes.shape({
      enterGeneral: PropTypes.func,
      leaveGeneral: PropTypes.func
    })
  };

  componentWillMount() {
    this.props.actions.enterGeneral();
  }

  componentWillUnmount() {
    this.props.actions.leaveGeneral();
  }

  render() {
    return(
      <AnimatedView>
        <div className="row">
          <div className="col-md-12">

          </div>
        </div>
        <div className="row">
          <div className="col-md-2">
          </div>
          <div className="col-md-2">
          </div>
          <div className="col-md-2">
          </div>
          <div className="col-md-2">
          </div>
          <div className="col-md-2">
          </div>
          <div className="col-md-2">
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="row">
              <div className="col-md-12">
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <section className="panel">
          <header className="panel-heading tab-bg-dark-navy-blue tab-right ">
            <ul className="nav nav-tabs pull-right">
              <li className="active">
                <a
                  data-toggle="tab"
                  href="#home-3">
                  <i className="fa fa-home"></i>
                </a>
              </li>
                <li className="">
                  <a
                    data-toggle="tab"
                    href="#about-3">
                    <i className="fa fa-user"></i>
                    &nbsp;About
                  </a>
                </li>
                <li className="">
                  <a
                    data-toggle="tab"
                    href="#contact-3">
                    <i className="fa fa-envelope-o"></i>
                    &nbsp;Contact
                  </a>
                </li>
              </ul>
            </header>
            <div className="panel-body">
              <div className="tab-content">
                <div
                  id="home-3"
                  className="tab-pane active">
                  &nbsp;Home
                </div>
                <div
                  id="about-3"
                  className="tab-pane">
                  &nbsp;About
                </div>
                <div
                  id="contact-3"
                  className="tab-pane">
                  &nbsp;Contact
                </div>
              </div>
            </div>
          </section>
          {/* <!--tab nav end--> */}
          <div className="row">
            <div className="col-md-12">
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
            </div>
          </div>
        </div>
      </div>
    </AnimatedView>
    );
  }
}

export default General;
