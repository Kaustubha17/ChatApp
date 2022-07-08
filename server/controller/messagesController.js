const messageModel = require("../model/messageModel");

const addMessage = async (req, res, next) => { 
    try {
        const { from, to, message } = req.body;
        const data = await messageModel.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });
        if (data) return res.json({ msg: "Message added successfully" })
        return res.json({msg:"Failed to add message to the database"})

    } catch (err) {
        console.log(err);
        return res.status(404);
    }
}
const getAllMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await messageModel.find({
            users:{
$all:[from,to],
            },
        }).sort({ updatedAt: 1 })
        const projectMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message:msg.message.text,
            }
        })
        res.json(projectMessages);
        
    } catch (err) {
        console.log("could not fetch messages")
    }
 }

module.exports={addMessage,getAllMessage}