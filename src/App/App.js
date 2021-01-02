import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
//import dummyStore from '../dummy-store';
import {getNotesForFolder, findNote, findFolder} from '../notes-helpers';
import './App.css';

import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import config from '../config'


class App extends Component {
    state = {
        notes: [],
        folders: [],
        //noteID: 0,
        //folderID: 0
    };

    componentDidMount() {
        Promise.all([
          fetch(`${config.API_ENDPOINT}/notes`),
          fetch(`${config.API_ENDPOINT}/folders`)
        ])
          .then(([notesRes, foldersRes]) => {
            if (!notesRes.ok)
              return notesRes.json().then(e => Promise.reject(e))
            if (!foldersRes.ok)
              return foldersRes.json().then(e => Promise.reject(e))
    
            return Promise.all([
              notesRes.json(),
              foldersRes.json(),
            ])
          })
          .then(([notes, folders]) => {
            this.setState({ notes, folders })
          })
          .catch(error => {
            console.error({ error })
          })
      }

    folderReload = (data) =>{
        console.log('folderReload ran');

        var newFolder = {"id": data.id, "name": data.name};
        var newFolderList = this.state.folders.concat(newFolder);
        this.setState({ folders: newFolderList });
        
    }
    
    folderSubmit = (f) => {
        //console.log("folderSubmit ran " + f);

        const newFolder = { "name" : f };

        const postfolder = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
              },
            body: JSON.stringify(newFolder)
        };
        
        fetch(`${config.API_ENDPOINT}/folders`, postfolder)  
        .then(response => response.json())
        .then(data => this.folderReload(data))

    }

    noteSubmit = (n,c) => {
        console.log("noteSubmit ran");

        var date = new Date();

        var newNote = {"id": "newNote" + this.state.noteID, "name": n, "modified": date, "content": c};
        var newNoteID = this.state.noteID + 1;
        this.setState({noteID: newNoteID});

        //console.log("new note: " + JSON.stringify(newNote));

        var newNoteList = this.state.notes.concat(newNote);
        this.setState({ notes: newNoteList});
    }

    renderNavRoutes() {
        const {notes, folders} = this.state;
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => (
                            <NoteListNav
                                folders={folders}
                                notes={notes}
                                {...routeProps}
                            />
                        )}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(notes, noteId) || {};
                        const folder = findFolder(folders, note.folderId);
                        return <NotePageNav {...routeProps} folder={folder} />;
                    }}
                />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        const {notes, folders} = this.state;
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => {
                            const {folderId} = routeProps.match.params;
                            const notesForFolder = getNotesForFolder(
                                notes,
                                folderId
                            );
                            return (
                                <NoteListMain
                                    {...routeProps}
                                    notes={notesForFolder}
                                />
                            );
                        }}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(notes, noteId);
                        return <NotePageMain {...routeProps} note={note} />;
                    }}
                />
                <ErrorBoundary>
                <Route
                    path="/add-folder"
                    render={routeProps => {
                        return <AddFolder addNewFolder={this.folderSubmit}/> 
                    }}
                />
                    </ErrorBoundary>
                <ErrorBoundary>
                 <Route
                    path="/add-note"
                    render={routeProps => {
                        return <AddNote addNewNote={this.noteSubmit}/> 
                    }}
                />
                    </ErrorBoundary>
            </>
        );
    }

    render() {
        return (
            <div className="App">
                <nav className="App__nav">{this.renderNavRoutes()}</nav>
                <header className="App__header">
                    <h1>
                        <Link to="/">Noteful</Link>{' '}
                        <FontAwesomeIcon icon="check-double" />
                    </h1>
                </header>
                <main className="App__main">{this.renderMainRoutes()}</main>
            </div>
        );
    }
}

export default App;
