const activity = require("../models/activity");
const Bank = require("../models/bank");
const booking = require("../models/booking");
const category = require("../models/category");
const Item = require("../models/item");
const Member = require("../models/member");
const Booking = require("../models/booking");
const fs = require("fs");
const path = require("path");

module.exports = {
    landingPage: async (req, res) => {
        try {
            const mostPicked = await Item.find()
                .select('_id title country city price unit imageId')
                .limit(5)
                .populate({
                    path: 'imageId',
                    select: '_id imageUrl',
                });

            const categories = await category.find()
                .select('_id name')
                .limit(3)
                .populate({
                    path: 'itemId',
                    select: '_id title country city isPopular unit imageId',
                    perDocumentLimit: 4,
                    options: {
                        sort: {
                            sumBooking: -1
                        }
                    },
                    populate: {
                        path: 'imageId',
                        select: '_id imageUrl',
                        perDocumentLimit: 1,
                    }
                });

            const travelers = await booking.find();
            const treasures = await activity.find();
            const cities = await Item.find();

            categories.forEach((category) => {
                category.itemId.forEach( async (itemId) => {
                    const item = await Item.findOne({ _id: itemId });
                    item.isPopular = false;
                    await item.save();
                    
                    if (itemId === category.itemId[0]) {
                        item.isPopular = true;
                        await item.save();
                    }
                })
            })

             const testimonial = {
                _id: "asd1293uasdads1",
                imageUrl: "images/testimonial2.jpg",
                name: "Happy Family",
                rate: 4.55,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Angga",
                familyOccupation: "Product Designer"
            }

            res.status(200).json({
                hero: {
                    travelers: travelers.length,
                    treasures: treasures.length,
                    cities: cities.length,
                },
                mostPicked,
                category: categories,
                testimonial
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    },
    detailPage: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({ _id: id })
                .populate({
                    path: 'featureId',
                    select: '_id qty',
                    populate: {
                        path: 'category',
                        select: 'name imageUrl',
                    }
                })
                .populate({
                    path: 'activityId',
                    select: '_id name type imageUrl',
                })
                .populate({
                    path: 'imageId',
                    select: 'imageUrl'
                });

            const bank = await Bank.find();

            const testimonial = {
                _id: "asd1293uasdads1",
                imageUrl: "images/testimonial1.jpg",
                name: "Happy Family",
                rate: 4.55,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Angga",
                familyOccupation: "Product Designer"
            }

            res.status(200).json({
                ...item._doc,
                bank,
                testimonial
            });

        } catch (error) {
             res.status(500).json({ message: "Internal server error" });
        }
    },
    bookingPage: async (req, res) => {
        try {
            const {
                itemId,
                duration,
                bookingStartDate,
                bookingEndDate,
                firstName,
                lastName,
                email,
                phoneNumber,
                accountHolder,
                bankFrom
            } = req.body;
    
            if (!req.file) {
                return res.status(404).json({message: 'Image not found'})
            }
    
            if (
                itemId === undefined ||
                duration === undefined ||
                bookingStartDate === undefined ||
                bookingEndDate === undefined ||
                firstName === undefined ||
                lastName === undefined ||
                email === undefined ||
                phoneNumber === undefined ||
                accountHolder === undefined ||
                bankFrom === undefined) {
                res.status(404).json({ message: "Please fill in all form field" });
            }
    
            const item = await Item.findOne({ _id: itemId });
    
            if (!item) return res.status(404).json({ message: 'item not found' });
    
            item.sumBooking += 1;
            await item.save();
    
            let total = item.price + duration;
            let tax = total * 0.10;
            const invoice = Math.floor(1000000 + Math.random() * 9000000);
    
            const member = await Member.create({
                 firstName,
                 lastName,
                 email,
                 phoneNumber
            });
    
            const newBooking = {
                invoice,
                startDate: bookingStartDate,
                endDate: bookingEndDate,
                total: total += tax,
                itemId: {
                    _id: itemId,
                    title: item.title,
                    price: item.price,
                    duration: duration
                },
                memberId: member.id,
                payments: {
                    proofOfPayment: `images/${req.file.filename}`,
                    bankFrom: bankFrom,
                    accountHolder: accountHolder
                }
            }
    
            const booking = await Booking.create(newBooking);
            res.status(201).json({message: 'Success Booking', booking})
            
        } catch (error) {
            if (req.file) {
                fs.unlinkSync(path.join(`public/images/${req.file.filename}`));
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }
}