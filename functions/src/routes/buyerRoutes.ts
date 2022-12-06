import { ensureAuthenticated } from "../middleware/middleware";
import { app } from "../index";
import {
    deleteBuyerListingController,
    getBuyerListingsForItemController,
    getBuyerListingsForRealmController,
    getBuyerListingsForWowAccountController,
    saveBuyerListingController,
    updateBuyerListingController,
    updateBuyerListingTimestampsController
} from "../controllers/buyerListingsControllers";


// Basic Listings CRUD
app.post("/buyer_listings", ensureAuthenticated, saveBuyerListingController);
app.put("/buyer_listings/:id", ensureAuthenticated, updateBuyerListingController);
app.delete("/buyer_listings/:id", ensureAuthenticated, deleteBuyerListingController);

// Other
app.get("/:region/buyer_listings", ensureAuthenticated, getBuyerListingsForWowAccountController);
app.get("/:region/:realm/buyer_listings", getBuyerListingsForRealmController);
app.get("/:region/:realm/buyer_listings/item/:id", getBuyerListingsForItemController);
app.get("/:region/buyer_listings/ping", ensureAuthenticated, updateBuyerListingTimestampsController);