const express = require('express');
const Notes = require('../models//Notes')
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');


 

//ROUTE1: Get all the notes using: GET "/api/notes/fetchallnotes" Login Required
router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try{
    const notes = await Notes.find({user: req.user.id})
    res.json(notes);
} catch (error) {
    console.error(error.message);
     res.status(500).send("Internal Server Error") ;  
}
})

//ROUTE2: Add a new note using: GET "/api/notes/addnotes" Login Required
router.post('/addnotes', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 6 }),
],async (req, res)=>{
    try {
    const {title, description , tag } = req.body;

    //if there any errors return bad request ant the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note = new Notes({
        title, description, tag, user: req.user.id
    })
    const saveNote = await note.save()
    res.json(saveNote);
} catch (error) {
    console.error(error.message);
     res.status(500).send("Internal Server Error") ;  
}
})

//ROUTE3: Update an existing note using: PUT "/api/notes/updatenote". Login Required
router.put('/updatenote/:id', fetchuser, async (req , res)=>{
    const {title, description , tag} = req.body;
try{
    //Create a newNote object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    //Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if(!note){
        return res.status(404).send("Not Found")
    }
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
    }

    note = await Notes.findByIdAndUpdate(req.params.id , {$set: newNote}, {new: true})
    res.json({note});
} catch (error) {
    console.error(error.message);
     res.status(500).send("Internal Server Error") ;  
}

})


//ROUTE4: Update an existing note using: DELETE "/api/notes/deletenote". Login Required
router.delete('/deletenote/:id', fetchuser, async (req , res)=>{



    //Find the note to be delete and delete it
    let note = await Notes.findById(req.params.id);
    if(!note){
        return res.status(404).send("Not Found")
    }

    //Allow deletion only if user owns this note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed")
    }

    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"success":"Note has been Deleted", note: note});


})
module.exports = router;