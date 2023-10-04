import React, { useState } from "react";
import NoteContext from "./noteContext";


const NoteState = (props)=>{
    // const s1 = {
    //     "name": "ram",
    //     "class": "8a"
    // }

    // const [state, setState] = useState(s1);

    // const update = ()=>{
    //     setTimeout(() => {
    //         setState({
    //             "name": "shyam",
    //             "class": "10b"
    //         })
    //     }, 1000);
    // }
    const host = "http://localhost:5000"

    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial)

    //Get All Notes
    const getAllNotes = async ()=>{
      //API call
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });
      const json =await response.json()
      setNotes(json)
    }

    //Add a note
    const addNote = async (title , description , tag)=>{
      //API call
      const response = await fetch(`${host}/api/notes/addnotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({title , description , tag})
      });
      const note = await response.json();
      setNotes(notes.concat(note)) //concat returns array while push updates a array
    }

    //delete a note
    const deleteNote = async (id)=>{
      //API call
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });
      const json = response.json();
      console.log(json);

      const newNotes = notes.filter((note)=>{return note._id !== id})
      setNotes(newNotes);
    }

    //edit a note
    const editNote = async (id, title , description , tag)=>{
      //API call
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(title , description , tag)
      });
      const json =await response.json();
      console.log(json);
    
      let newNotes = JSON.parse(JSON.stringify(notes))
      //Logic to edit in client
      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if(element._id === id){
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag;
          break;
        }
      }
      // console.log(id , notes);
      setNotes(newNotes);
    }
    return  (
        <NoteContext.Provider value={{notes , addNote , editNote , deleteNote ,getAllNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;