const router = require('express').Router();
const {
    getUsers,
    getSingleUser,
    createUser,
    deleteUser,
    updateUser,
    makeFriend,
    deleteFriend,
} = require('../../controllers/userController');

//api/users
router.route('/').get(getUsers).post(createUser);

//api/users/userID/
router.route('/:userId').get(getSingleUser).delete(deleteUser).put(updateUser);

//api/users/userId/friends/friendId
router.route('/:userId/friends/:friendId').post(makeFriend).delete(deleteFriend);

module.exports = router;