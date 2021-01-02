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

        var newFolderItem = {"id": data.id, "name": data.name};
        var newFolderList = this.state.folders.concat(newFolderItem);
        this.setState({ folders: newFolderList });
        
    }
    
    folderSubmit = (f) => {
        //console.log("folderSubmit ran " + f);

        const newFolder = { "name" : f };

        const postFolder = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
              },
            body: JSON.stringify(newFolder)
        };
        
        fetch(`${config.API_ENDPOINT}/folders`, postFolder)  
        .then(response => response.json())
        .then(data => this.folderReload(data))

    }

    noteReload = (data) => {
        console.log('noteReload ran');

        var newNoteItem = {"id": data.id, "name": data.name, "content": data.content, "modified": data.modified, "folder": data.folder}

        var newNoteList = this.state.notes.concat(newNoteItem);
        this.setState({ notes: newNoteList});

    }

    noteSubmit = (n,c,f) => {
        console.log("noteSubmit ran");

        var date = new Date();

        const newNote = { "name": n, "content": c, "modified": date, "folder": f}

        const postNote = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newNote)
        };

        fetch(`${config.API_ENDPOINT}/notes`, postNote)  
        .then(response => response.json())
        .then(data => this.noteReload(data))

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
                        return <AddNote addNewNote={this.noteSubmit} folders={this.state.folders}/> 
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
