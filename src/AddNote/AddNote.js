import React, {Component} from 'react';
import { NavLink, Link } from 'react-router-dom'

import './AddNote.css';

export default class AddNote extends Component{

    handleSubmit = (e) => {
      e.preventDefault();
      console.log("handleSubmit ran");

      var nameError = document.getElementById("noteNameError");

      if (!e.target.name.value){
        nameError.classList.remove("hidden");
          return console.log("no name");
      }
      
      nameError.classList.add("hidden");
      
      return this.props.addNewNote(e.target.name.value, e.target.content.value, e.target.folder.value);
      // process form values here
  
    }
  
  render(){
    const folders = this.props.folders; 
    return (
      <form className="noteForm" onSubmit={(e) => this.handleSubmit(e)}>
          <h3>New Folder</h3>
          <div>
            <label>Text </label>
            <input type="text" className="elementName" name="name" id="noteName"/>
            </div>
          <div>
              <label>Content</label>
              <input type="text" className="elementName" name="content" id="noteContent"/>
              </div>
            <select id='note-folder-select' name='folder'>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
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
            <p className="hidden" id="noteNameError">A name is required</p>
        </div>
      </form>
    )
  }
  }