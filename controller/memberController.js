const member = require('./../models/member');
const _ = require('lodash');

exports.createMember = async (req, res) => {

    try {

        let memberData = await member.getByEmail(req.body.email);
        
        if(memberData){
            return res.status(400).json({
                status:'error',
                message:'Member with provided email address already exists.'
            });
        }

        let newMember = new member(req.body.email, req.body.firstName, req.body.middleInitial, req.body.lastName, req.body.phoneNumber, req.body.gender);
        await newMember.save();
        return res.json({status:'success',data:newMember});

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            status:'error',
            message:'Internal Server Error'
        });

    }

}

exports.updateMember = async (req, res) => {

    try {

        let memberData = await member.getByEmail(req.params.email);
        
        if(!memberData){
            return res.status(404).json({
                status:'error',
                message:'Member with provided email address not found.'
            });
        }
       
        let updateData = _.pick(req.body,['firstName','middleInitial','lastName','phoneNumber','gender']);
        memberData = member.fromMap({...memberData,...updateData});
        await memberData.save();

        return res.json({status:'success',data:memberData});

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            status:'error',
            message:'Internal Server Error'
        });

    }

}

exports.listMember = async (req, res) => {
    
    try {

        let memberList = await member.getAll();
        
        return res.json({
            status:'success',
            data: memberList
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            status:'error',
            message:'Internal Server Error'
        });

    }

}

exports.deleteMember = async (req, res) => {

    try {

        const memberData = await member.getByEmail(req.params.email);

        if (!memberData) {
            return res.status(404).json({status:'error',message:"Member with provided email address does not exist."});
        }

        await memberData.delete();

        return res.json({
            status:'success',
            message:'Member deleted successfully'
        });

    } catch (error){

        console.error(error);

        return res.status(500).json({
            status:'error',
            message:'Internal Server Error'
        });

    }

}


exports.getByEmail = async (req, res) => {

    try {

        let memberData = await member.getByEmail(req.params.email);
        
        if(!memberData){
            return res.status(404).json({
                status:'error',
                message:'Member with provided email address not found.'
            });
        }
        
        return res.json({
            status:'success',
            data: memberData
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            status:'error',
            message:'Internal Server Error'
        });

    }

}