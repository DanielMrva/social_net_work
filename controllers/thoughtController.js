const { ObjectId } = require('mongoose');
const { User, Thought } = require('../models');

module.exports = {
    //gets all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            // .catch((err) => res.status(500).json(err));
            .catch((err) => {
                console.log(err)
                res.status(500).json(err);
            })
    },
    //gets single thought by _id
    getSingleThought(req, res) {
        Thought.findOne({_id: req.params.thoughtId})
            .select('-__v')
            .then((thought) => !thought ? res.status(404).json({message: 'No user with that ID'}):res.json(thought))
            .catch((err) => res.status(500).json(err));
    },
    //creats a new thought
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                console.log(thought);
                return User.findOneAndUpdate(
                    {userName: req.body.userName},
                    {$addToSet: {thoughts: thought._id}},
                    {runValidators: true, new: true}
                );
            })
            .then((user) => 
                !user
                    ? res.status(404).json({message: 'Thought created but who thunk it?...'})
                    : res.json(user)
            )
            .catch((err) => {
                res.status(500).json(err)
            })
    },
    //updates a single thought by _id
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$set: req.body},
            {runValidators: true, new: true})
            .then((thought) => 
                !thought
                    ? res.status(404).json({message: 'No thought found by that id'})
                    : res.json(thought)
            )
            .catch((err) => {
                res.status(500).json(err);
            });
    },
    //deletes a thought and removes it from User's thought list
    deleteThought(req, res) {
        Thought.findOneAndDelete({_id: req.params.thoughtId})
        .then((thought) => 
            !thought
                ? res.status(404).json({message: 'No thought found by that id'})
                : User.findOneAndUpdate(
                    {thoughts: req.params.thoughtId},
                    {$pull: {thoughts: req.params.thoughId}},
                    {runValidation: true, new: true}
                )
                .then((user) => 
                    !user
                        ? res.status(404).json({message: 'Thought removed but who thunk it?...'})
                        : res.json({message: 'Thought removed sucessfully'})
                )
                .catch((err) => res.status(500).json(err))
        )
    },
    //creates a reaction
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$addToSet: {reactions: req.body}},
            {runValidators: true, new: true})
            .then((thought) => 
                !thought
                    ? res.status(404).json({message: 'No thought found by that Id'})
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err))
    },
    //deletes a reaction by it's reactionId (not _id).
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            { $pull: {reactions: {reactionId: req.params.reactionId} } },
            {runValidators: true, new: true})
            .then((thought) =>
                !thought
                    ? res.status(404).json({message: 'No thought found by that id'})
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    }
};