const express = require('express');
const Service = require('../Models/serviceSchema');
const UserSchema = require('../Models/userSchema');
const app = express();
// search services based on names tags and description
app.get('/searchname/:query', async (req, res) => {
    try {
        const query = req.params.query;

        // Split the query into words
        const words = query.split(' ');

        // Build the aggregation pipeline to search in serviceName and serviceTags
        const pipeline = [
            {
                $match: {
                    $text: { $search: query } // Search in serviceName
                }
            },
            {
                $addFields: {
                    score: {
                        $size: {
                            $setIntersection: ['$serviceTags', words] // Calculate the score based on matched tags
                        }
                    }
                }
            },
            {
                $sort: { score: -1 } // Sort by score in descending order
            },
            {
                $limit: 5
            },
            {
                $project: {
                    _id: 0,
                    serviceName: 1
                }
            }
        ];
        const results = await Service.aggregate(pipeline);

        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get("/search/:query/:page", async (req, res) => {
    const query = req.params.query;
    // I want to find the query in serviceName,serviceBrief and want to split query into words and search those words in serviceTags 

    const words = query.split(' ');
    var page = req.params.page
    if (!page || page < 1) {
        page = 1
    }
    const pipeline = [
        {
            $match: {
                $text: { $search: query }, // Search in serviceName,serviceBrief
            }
        },
        {
            $addFields: {
                score: {
                    $size: {
                        $setIntersection: ['$serviceTags', words] // Calculate the score based on matched tags
                    }
                }
            }
        },
        {
            $sort: { score: -1 } // Sort by score in descending order
        },
        {
            $skip: (page - 1) * 5
        },
        {
            $limit: 5
        },
        {
            $lookup: {
                from: "users",
                localField: "serviceProvider",
                foreignField: "_id",
                as: "serviceProvider"
            }
        },
        {
            $project: {
                _id: 1,
                serviceName: 1,
                serviceBrief: 1,
                serviceTags: 1,
                serviceCost: 1,
                serviceCostCurrency: 1,
                serviceCostDuration: 1,
                rating: 1,
                reviewCount: 1,
                serviceProvider: {
                    username: "$serviceProvider.username",
                    profilePic: "$serviceProvider.profilePic",
                    location: "$serviceProvider.location",
                    userId: "$serviceProvider._id",

                }
            }
        }
    ];

    const results = await Service.aggregate(pipeline);


    res.json(results);
})







module.exports = app;

