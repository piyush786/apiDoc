import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'

class Header extends Component {

  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="#">
          <img src="/imgs/logo.png" height="60" className="d-inline-block align-top" alt=""/>
        </a>
      </nav>
    );
  }
}

export default Header;
