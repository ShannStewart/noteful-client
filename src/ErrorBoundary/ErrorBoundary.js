import React, {Component} from 'react';
import { NavLink, Link } from 'react-router-dom'

export default class ErrorBoundary extends Component{
    constructor(props){
        super(props);
        this.state = {
            hasError: false
          };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
      }
      
      render() {
        if (this.state.hasError) {      
          return (
            <h2>Error. ERROR!</h2>
          );
        }
        return this.props.children;
      }  

}