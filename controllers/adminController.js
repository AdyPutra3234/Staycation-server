const Category = require('../models/category');
const Bank = require('../models/bank');
const Item = require('../models/item');
const Images = require('../models/image');
const Feature = require('../models/feature');
const Activity = require('../models/activity');
const Users = require('../models/users');
const Booking = require('../models/booking');
const Member = require('../models/member');


const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = {
    viewLogin: (req, res) => {
        try {
            const message = req.flash('alertMessage');
            const status = req.flash('alertStatus');
            const show = req.flash('isShow');

            const alert = {
                message,
                status,
                show,
            }; 
    
            if (req.session.user == null || req.session.user == undefined) {
                res.render('index', {
                    alert,
                    title: "Staycation | Login"
                });
            } else {
                res.redirect('/admin/dashboard');
            }

        } catch(error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/login');
        }
    },
    onLogin: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await Users.findOne({ username: username });

            if (!user) {
                req.flash('alertMessage', 'User not found, please check your username!');
                req.flash('alertStatus', 'danger');
                req.flash('isShow', 'show');
                res.redirect('/admin/login');
            } else {
                const isPasswordMatch = bcrypt.compareSync(password, user.password);
    
                if (!isPasswordMatch) {
                    req.flash('alertMessage', 'Incorrect password, check your password!');
                    req.flash('alertStatus', 'danger');
                    req.flash('isShow', 'show');
                    res.redirect('/admin/login');
                }

                if (user && isPasswordMatch) {
                    req.session.user = {
                        id: user._id,
                        username: user.username,
                    };
        
                    res.redirect('/admin/dashboard');
                }
            }

        } catch (error) {
            console.log(error);
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/login');
            
        }
    },
    onLogout: (req, res) => {
        req.session.destroy();
        res.redirect('/admin/login');
    },
    viewDashboard: async (req, res) => {
        const members = await Member.count();
        const bookings = await Booking.count();
        const items = await Item.count();

        res.render('admin/dashboard/dashboard',{
            username: req.session.user.username,
            members,
            bookings,
            items,
        });
    },
    viewCategory: async (req, res) => {
        try {
            const categories = await Category.find()
            const message = req.flash('alertMessage');
            const status = req.flash('alertStatus');
            const show = req.flash('isShow');
            const alert = {
                message,
                status,
                show,
            };

            res.render('admin/category/category', {
                categories,
                alert,
                username: req.session.user.username,
            });
        } catch(error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/admin/category/');
        }
        
    },
    addCategory: async (req, res) => {
        try {
            const { name } = req.body;
            await Category.create({name});
            req.flash('alertMessage', 'Success Add Category');
            req.flash('alertStatus', 'success');
            req.flash('isShow', 'show');
    
            res.redirect('/admin/category');
        } catch(error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            req.flash('isShow', 'show')
            res.redirect('/admin/category');
        }
    },
    editCategory: async (req, res) => {
        try {
            const {id, name} = req.body;
            const category = await Category.findOne({_id: id});
            category.name = name;
            await category.save();

            req.flash('alertMessage', 'Success Edit Category');
            req.flash('alertStatus', 'success');
            req.flash('isShow', 'show')

    
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            req.flash('isShow', 'show')

            res.redirect('/admin/category');
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const {id} = req.params;
            const category = await Category.findOne({_id: id});
            category.remove();

            req.flash('alertMessage', 'Success Deleted Category');
            req.flash('alertStatus', 'success');
            req.flash('isShow', 'show')
    
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            req.flash('isShow', 'show')

            res.redirect('/admin/category');
        }
    },
    viewBank: async (req, res) => {
        try {
            const banks = await Bank.find();
            const message = req.flash('alertMessage');
            const status = req.flash('alertStatus');
            const show = req.flash('isShow');

            const alert = {
                message,
                status,
                show,
            };
            res.render('admin/bank/bank', {
                banks,
                alert,
                username: req.session.user.username,
            });
        } catch(error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            req.flash('isShow', 'show')
            res.redirect('/admin/bank');
        }
    },
    addBank: async (req, res) => {
        try {
            const { bankName, accountNumber, userName } = req.body;
            await Bank.create({
                bankName,
                accountNumber,
                userName,
                imageUrl: `images/${req.file.filename}`,
            });

            req.flash('alertMessage', 'Success Add Bank');
            req.flash('alertStatus', 'success');
            req.flash('isShow', 'show')
    
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            req.flash('isShow', 'show')

            res.redirect('/admin/bank');
        }
    },
    editBank: async (req, res) => {
        try {
            const {
                id, bankName, accountNumber, userName
            } = req.body;
            const bank = await Bank.findOne({_id: id});
            const image = req.file

            if (image == undefined) {
                bank.bankName = bankName;
                bank.accountNumber = accountNumber;
                bank.userName = userName;
                await bank.save();

                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                req.flash('isShow', 'show')

                res.redirect('/admin/bank');

            } else {
                await fs.unlink(path.join(`public/${bank.imageUrl}`));
                bank.bankName = bankName;
                bank.accountNumber = accountNumber;
                bank.userName = userName;
                bank.imageUrl = `images/${image.filename}`;
                await bank.save();

                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                req.flash('isShow', 'show')

                res.redirect('/admin/bank');
            }
        } catch (error) {
            req.flash('alertMessage', error.message);
            req.flash('alertStatus', 'danger');
            req.flash('isShow', 'show')

            res.redirect('/admin/bank');
        }
    },
    deleteBank: async (req, res) => {
        try {
            const { id } = req.params;
            const bank = await Bank.findOne({_id: id});
            await fs.unlink(path.join(`public/${bank.imageUrl}`));
            await bank.remove();
    
            req.flash('alertMessage', 'Success Deleted Category');
            req.flash('alertStatus', 'success');
            req.flash('isShow', 'show')

            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', error.message);
            req.flash('alertStatus', 'danger');
            req.flash('isShow', 'show')

            res.redirect('/admin/bank');
        }
    },
    viewItem: async (req, res) => {
        try {
            const items = await Item.find()
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name' });
            const categories = await Category.find();

            const message = req.flash('alertMessage');
            const status = req.flash('alertStatus');
            const show = req.flash('isShow');

            const alert = {
                message,
                status,
                show,
            };

            res.render('admin/item/item', {
                items,
                categories,
                alert,
                view: 'default',
                username: req.session.user.username,
            });

        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            req.flash('isShow', 'show')

            res.redirect('/admin/item');
        }
    },
    addItem: async (req, res) => {
        try {
            const {title, price, city, categoryId, description} = req.body;
            const images = req.files;
            if (images.length > 0) {
                const category = await Category.findOne({_id: categoryId});
                const newItem = {
                    categoryId: category._id,
                    title,
                    description,
                    price,
                    city,
                };

                const item = await Item.create(newItem);
                item.save();


                category.itemId.push({ _id: item._id });
                await category.save();
    
                images.forEach( async function(image) {
                    const imageSaved = await Images.create({ imageUrl: `images/${image.filename}` });
                    await Item.findOne({ _id: item._id })
                        .then( async (result) => {
                            result.imageId.push({ _id: imageSaved._id });
                            await result.save();
                        })
                        .catch((error) => {
                            throw new Error(error);
                        });
                });


                req.flash('alertMessage', 'Success Add Item');
                req.flash('alertStatus', 'success');
                req.flash('isShow', 'show');

                res.redirect('/admin/item');
            }

        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            req.flash('isShow', 'show')

            res.redirect('/admin/item');
        }
    },
    viewItemImages: async (req, res) => {
        try {
            const {id} = req.params;
            const { imageId: image } = await Item.findOne({_id: id})
                .populate({ path: 'imageId', select: 'id imageUrl'});
    
            const message = req.flash('alertMessage');
            const status = req.flash('alertStatus');
            const show = req.flash('isShow');
    
            const alert = {
                message,
                status,
                show,
            };
            
            res.render('admin/item/item', {
                itemId: id,
                image,
                alert,
                view: 'show images',
                username: req.session.user.username,
            });
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            req.flash('isShow', 'show')

            res.redirect('/admin/item');
        }
    },
    viewEditItem: async (req, res) => {
        try {
            const {id} = req.params;
            const item = await Item.findOne({_id: id})
                .populate({ path: 'categoryId', select: 'id name' });

            const categories = await Category.find();

            const message = req.flash('alertMessage');
            const status = req.flash('alertStatus');
            const show = req.flash('isShow');
    
            const alert = {
                message,
                status,
                show,
            };
            
            res.render('admin/item/item', {
                item,
                categories,
                alert,
                view: 'show form-edit',
                username: req.session.user.username,
            });
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            req.flash('isShow', 'show')

            res.redirect('/admin/item');
        }
    },
    editItem: async (req,res) => {
        try {
            const { title, price, city, categoryId, description } = req.body;
            const { id } = req.params;
            const images = req.files;

            const item = await Item.findOne({ _id: id });

            if (images.length > 0) {
                images.forEach(async (image) => {
                    const imageSaved = await Images.create({ imageUrl: `images/${image.filename}`});
                    await Item.findOne({ _id: id })
                        .then(async (result) => {
                            result.imageId.push({ _id: imageSaved._id }); 
                            await result.save();
                        })
                        .catch((error) => {
                            throw new Error(error);
                        });
                });
            }

            item.title = title;
            item.price = price;
            item.city = city;
            item.categoryId= categoryId;
            item.description = description;
            await item.save()

            req.flash('alertMessage', 'Success udate Item');
            req.flash('alertStatus', 'success');
            req.flash('isShow', 'show');

            res.redirect('/admin/item');

        } catch (error) {
            req.flash('alertMessage', error.message);
            req.flash('alertStatus', 'danger');
            req.flash('isShow', 'show');

            res.redirect('/admin/item');
        }
    },
    addImagesItem: async (req, res) => {
        try {
            const { id } = req.params;
            const images = req.files;
            
            if (images.length > 0) {
                images.forEach(async function(image) {
                    const item = await Item.findOne({ _id: id });
                    const imageSaved = await Images.create({ imageUrl: `images/${image.filename}` });
                    item.imageId.push({ _id: imageSaved._id });
                    await item.save();
                });
            }

            req.flash('alertMessage', 'Success Update images');
            req.flash('alertStatus', 'success');
            req.flash('isShow', 'show');

            res.redirect(`/admin/item/${id}/images`);
            
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            req.flash('isShow', 'show')

            res.redirect(`/admin/item/${id}/images`);
        }

    },
    deleteImageItem: async (req, res) => {
        try {
            const { itemId, imageId } = req.params;
            const item = await Item.findOne({ _id: itemId })
                .populate({ path: 'imageId', select: 'id imageUrl' });
            const image = await Images.findOne({ _id: imageId });

            await fs.unlink(path.join(`public/${image.imageUrl}`));

            await Images.deleteOne({ _id: imageId });
            await item.imageId.pull({ _id: imageId });

            await item.save();

            req.flash('alertMessage', 'Success Delete image');
            req.flash('alertStatus', 'success');
            req.flash('isShow', 'show');

            res.redirect(`/admin/item/${itemId}/images`);
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            req.flash('isShow', 'show')

            res.redirect('/admin/item');
        }
    },
    deleteItem: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({ _id: id })
                .populate({ path: 'imageId', select: 'id imageUrl' });

            item.imageId.forEach( async (image) => {
                await fs.unlink(path.join(`public/${image.imageUrl}`));
                await Images.deleteOne({ _id: image._id });
            });

            await item.deleteOne({ _id: id });

            req.flash('alertMessage', 'Success Delete item');
            req.flash('alertStatus', 'success');
            req.flash('isShow', 'show');

            res.redirect(`/admin/item/`);

        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            req.flash('isShow', 'show')

            res.redirect('/admin/item');
        }
    },
    viewDetailItem: async (req, res) => {
        const { id } = req.params;

        try {
            const features = await Feature.find({ itemId: id });
            const activities = await Activity.find({ itemId: id });

            const message = req.flash('alertMessage');
            const status = req.flash('alertStatus');
            const show = req.flash('isShow');

            const alert = {
                message,
                status,
                show,
            };

            res.render('admin/item/detail/detail_page', {
                itemId: id,
                alert,
                features,
                activities,
                username: req.session.user.username,
            });
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            req.flash('isShow', 'show')

            res.redirect(`/admin/item/detail/${id}`);
        }
    },
    addItemFeature: async (req, res) => {
        const { id } = req.params;
        const { name, qty } = req.body;
        const image = req.file;

        try {
            if (image) {
                const item = await Item.findOne({ _id: id });
                const feature = await Feature.create({
                    name,
                    qty,
                    imageUrl: `images/${image.filename}`,
                    itemId: item._id,
                });
    
                item.featureId.push({ _id : feature._id });
                await item.save();

                req.flash('alertMessage', 'Success add feature');
                req.flash('alertStatus', 'success');
                req.flash('isShow', 'show');

            res.redirect(`/admin/item/detail/${id}`);
            } 
        } catch (error) {
            req.flash('alertMessage', error.message);
            req.flash('alertStatus', 'danger');
            req.flash('isShow', 'show');

            res.redirect(`/admin/item/detail/${id}`);
        }
    },
    editFeature: async (req, res) => {
        const { itemId, featureId } = req.params;
        const { name, qty } = req.body;
        const image = req.file;

        try {

            const feature = await Feature.findOne({ _id: featureId });

            if (image) {
                await fs.unlink(path.join(`public/${feature.imageUrl}`));
                feature.imageUrl = `images/${image.filename}`;
            }

            feature.name = name;
            feature.qty = qty;
            
            await feature.save()

            req.flash('alertMessage', 'Success update feature');
            req.flash('alertStatus', 'success');
            req.flash('isShow', 'show');

            res.redirect(`/admin/item/detail/${itemId}`);

        } catch (error) {
            req.flash('alertMessage', error.message);
            req.flash('alertStatus', 'danger');
            req.flash('isShow', 'show');

            res.redirect(`/admin/item/detail/${itemId}`);
        }
    },
    deleteFeature: async (req, res) => {
        const { itemId, featureId } = req.params;
        try {
            const feature = await Feature.findOne({ _id: featureId });
            const item = await Item.findOne({ _id: itemId })
                .populate('featureId');

            await item.featureId.pull({ _id: featureId});
            await fs.unlink(path.join(`public/${feature.imageUrl}`))
            await feature.remove();
            await item.save();

            req.flash('alertMessage', 'Success delete feature');
            req.flash('alertStatus', 'success');
            req.flash('isShow', 'show');

            res.redirect(`/admin/item/detail/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', error.message);
            req.flash('alertStatus', 'danger');
            req.flash('isShow', 'show');

            res.redirect(`/admin/item/detail/${itemId}`);
        }
    },
    addItemActivity: async (req, res) => {
        const { id } = req.params;
        const { name, type } = req.body;
        const image = req.file;

        try {
            if (image) {
                const item = await Item.findOne({ _id: id });
                const activity = await Activity.create({
                    name,
                    type,
                    imageUrl: `images/${image.filename}`,
                    itemId: item._id,
                });
    
                item.activityId.push({ _id : activity._id });
                await item.save();

                req.flash('alertMessage', 'Success add activity');
                req.flash('alertStatus', 'success');
                req.flash('isShow', 'show');

            res.redirect(`/admin/item/detail/${id}`);
            } 
        } catch (error) {
            req.flash('alertMessage', error.message);
            req.flash('alertStatus', 'danger');
            req.flash('isShow', 'show');

            res.redirect(`/admin/item/detail/${id}`);
        }
    },
    editActivity: async (req, res) => {
        const { itemId, activityId } = req.params;
        const { name, type } = req.body;
        const image = req.file;

        try {

            const activity = await Activity.findOne({ _id: activityId });

            if (image) {
                await fs.unlink(path.join(`public/${activity.imageUrl}`));
                activity.imageUrl = `images/${image.filename}`;
            }

            activity.name = name;
            activity.type = type;
            
            await activity.save()

            req.flash('alertMessage', 'Success update activity');
            req.flash('alertStatus', 'success');
            req.flash('isShow', 'show');

            res.redirect(`/admin/item/detail/${itemId}`);

        } catch (error) {
            req.flash('alertMessage', error.message);
            req.flash('alertStatus', 'danger');
            req.flash('isShow', 'show');

            res.redirect(`/admin/item/detail/${itemId}`);
        }
    },
    deleteActivity: async (req, res) => {
        const { itemId, activityId } = req.params;
        try {
            const activity = await Activity.findOne({ _id: activityId });

            const item = await Item.findOne({ _id: itemId })
                .populate('activityId');

            await item.activityId.pull({ _id: activityId});
            await fs.unlink(path.join(`public/${activity.imageUrl}`))
            await activity.remove();
            await item.save();

            req.flash('alertMessage', 'Success delete activity');
            req.flash('alertStatus', 'success');
            req.flash('isShow', 'show');

            res.redirect(`/admin/item/detail/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', error.message);
            req.flash('alertStatus', 'danger');
            req.flash('isShow', 'show');

            res.redirect(`/admin/item/detail/${itemId}`);
        }
    },
    viewBooking: async (req, res) => {
        const bookings = await Booking.find()
            .populate('memberId')
            .populate('bankId');

        res.render('admin/booking/booking', {
            username: req.session.user.username,
            bookings,
        });
    },
    viewDetailBooking: async (req, res) => {
        const { id } = req.params;
        const booking = await Booking.findOne({ _id: id })
            .populate('memberId');

        const message = req.flash('alertMessage');
        const status = req.flash('alertStatus');
        const show = req.flash('isShow');

        const alert = {
            message,
            status,
            show,
        };

        res.render('admin/booking/detail_booking', {
            alert,
            booking,
            username: req.session.user.username,
        });
    },
    onBookingAcception: async (req, res) => {
        const { id } = req.params;

        try {
            const booking = await Booking.findOne({ _id: id });
            booking.payments.status = 'Accepted';
            await booking.save();
            
            req.flash('alertMessage', 'Success accepted booking confirmation');
            req.flash('alertStatus', 'success');
            req.flash('isShow', 'show');

            res.redirect(`/admin/booking/${id}`);
        } catch (error) {
            
            req.flash('alertMessage', error.message);
            req.flash('alertStatus', 'danger');
            req.flash('isShow', 'show');

            res.redirect(`/admin/booking/${id}`);
        }
    },
    onBookingRejection: async (req, res) => {
        const { id } = req.params;

        try {
            const booking = await Booking.findOne({ _id: id });
            booking.payments.status = 'Rejected';
            await booking.save();
            
            req.flash('alertMessage', 'Success rejected booking confirmation');
            req.flash('alertStatus', 'success');
            req.flash('isShow', 'show');

            res.redirect(`/admin/booking/${id}`);
        } catch (error) {
            
            req.flash('alertMessage', error.message);
            req.flash('alertStatus', 'danger');
            req.flash('isShow', 'show');

            res.redirect(`/admin/booking/${id}`);
        }
    },
}