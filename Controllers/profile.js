const express = require('express');
const app = express();
const Users = require('../Models/userSchema')

app.get('/user/getprofile/:userId', async (req, res) => {
    const userId = req.params.userId
    try {
        const user = await Users.findById(userId, {username:1,email:1,fullname:1,about: 1, location: 1, profilePic: 1, services: 1, profileTags: 1, avgRating: 1, education: 1, achievements: 1, email: 1,createdAt: 1 ,avgResponseTime:1,skills:1})

        if (!user) {
            return res.status(404).json({ msg: "user not found" })
        }

        const createdAtDate = user.createdAt;
        const month = createdAtDate.getMonth() + 1; 
        const year = createdAtDate.getFullYear();


        return res.send({user,createdAtMonth:month,createdAtYear:year})
    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
})
app.get("/user/getcontact/:id", async (req, res) => {
    const id = req.params.id
    try {
        const user = await Users.findById(id, {
            phone: 1,
            socials: 1,
            personalSite: 1,
            payment: 1,
            location: 1,
            email: 1
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Extracting month and year from createdAt
        

        return res.send(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }

})

app.get("/user/getworkhistory/:id", async (req, res) => {
    const id = req.params.id
    try {
        const user = await Users.findById(id, {
            workHistory: 1,
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        return res.send(user)
    }

    catch (err) {
        console.log(err);
        res.send(500).send(err);
    }
})

module.exports = app;