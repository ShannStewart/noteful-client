import React, {Component} from 'react';
import { NavLink, Link } from 'react-router-dom'

import './AddFolder.css';

export default class AddFolder extends Component{
  
  handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit ran");

    var nameError = document.getElementById("folderNameError");

    if (!e.target.name.value){
      nameError.classList.remove("hidden");
      return console.log("no name");
  }

  nameError.classList.add("hidden");

    return this.props.addNewFolder(e.target.name.value);
    // process form values here

  }

render(){
  return (
    <form className="folderForm" onSubmit={(e) => this.handleSubmit(e)}>
	    <h3>New Folder</h3>
	    <label>Text </label>
	    <input type="text" className="elementName" name="name" id="folderName"/>
      <div>
        <button type="submit" className="registration__button">
                       Save
                   </button>
      </div>
      <div>
        <button type="reset" className="registration__button">
                        Cancel
                    </button>
      </div>
      <div className="errorSpace">
            <p className="hidden" id="folderNameError">A name is required</p>
        </div>
    </form>
  )
}
}
