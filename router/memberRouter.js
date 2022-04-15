const express = require('express');
const router = express.Router();
const { check } = require('express-validator/check');
const formValidationMiddleware = require('./../utils/middlewares/formValidationMiddleware');
const { createMember, listMember, getByEmail, deleteMember, updateMember } = require('./../controller/memberController');

router.post('/', [
    check('email').not().isEmpty().withMessage('Email is required.'),
    check('email').isEmail().withMessage('Provided email address is not valid.'),
    check('firstName').not().isEmpty().withMessage('First Name is required.'),
    check('lastName').not().isEmpty().withMessage('Last Name is required.'),
    check('middleInitial').not().isEmpty().withMessage('Middle Initial is required.'),
    check('middleInitial').isLength({min:1,max:1}).withMessage('Middle Initial is required.'),
    check('phoneNumber').not().isEmpty().withMessage('Phone Number is required.'),
    check('gender').isIn(['male', 'female']).not().isEmpty().withMessage('Gender is required. Gender should male/female.'),
], formValidationMiddleware, createMember);

router.get('/', listMember);
router.get('/:email', getByEmail);
router.put('/:email', updateMember);
router.delete('/:email', deleteMember);

module.exports = router;