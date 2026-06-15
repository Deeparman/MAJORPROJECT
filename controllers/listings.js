const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const { category } = req.query;

    let filter = { status: "approved" };

    if (category) {
        filter.category = { $regex: new RegExp(category, "i") };
    }

    let allList = await Listing.find(filter);

    if (category && allList.length === 0) {
        req.flash("error", `No listing found for ${category}`);
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allList, category });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing =async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({ 
        path: "reviews", 
        populate: { path: "author" } 
    })
    .populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newlist = new Listing(req.body.listing);

    newlist.owner = req.user._id;
    newlist.image = { url, filename };

    newlist.status = "pending";

    await newlist.save();

    req.flash("success", "Listing submitted for admin approval!");
    res.redirect("/owner");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    let original = listing.image.url;
    original= original.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing,original })
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listingUpdated = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listingUpdated.image = {url, filename};
        await listingUpdated.save();
    }

    req.flash("success", " listing updated successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.searchListing = async(req,res) =>{
    // res.send("this is the listing you searched for!!");
    try{
        let query = req.query.query;
        let allList = await Listing.find({
            $or: [
                { title: { $regex: query, $options: "i" } }, // Search by title (case-insensitive)
                { location: { $regex: query, $options: "i" } }, // Search by category
                { category: { $regex: query, $options: "i" } },
              ],
        })
        res.render("listings/index.ejs", { allList }); 
    } catch(e){
        console.error(e);
        res.status(500).send("Server Error");
      }
    }


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    if (!listing.owner.equals(req.user._id) && req.user.role !== "admin") {
        req.flash("error", "Not allowed");
        return res.redirect("/listings");
    }

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};