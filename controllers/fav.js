const User = require('../models/user.js');
const Listing = require('../models/listing.js');

module.exports.addtofav = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); 
        const listingId = req.params.id; 
        const listing = await Listing.findById(listingId);

        if (!user.favorites.includes(listing._id)) {
            user.favorites.push(listing._id); 
            await user.save();
            req.flash('success', "Listing added to favorites!");
        } else {
            req.flash('error', "Listing is already in favorites!");
        }

        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        req.flash('error', "An error occurred while adding to favorites.");
        res.redirect('back');
    }
};


module.exports.delfromfav = async (req,res) => {
    const user = await User.findById(req.user._id);
    const { id } = req.params;

    user.favorites.pull(id); 
    await user.save();

    req.flash('success', 'Listing removed from favorites.');
    res.redirect(`/favorites`);
}

module.exports.getFavorites = async (req, res) => {
    const user = await User.findById(req.user._id).populate('favorites');
    res.render('favorites/index.ejs', { favorites: user.favorites });
};

