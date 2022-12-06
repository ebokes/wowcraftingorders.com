import { ensureAuthenticated } from "../middleware/middleware";
import { app } from "../index";
import {
    deleteSellerListingController,
    getSellerListingsForItemController,
    getSellerListingsForRealmController,
    getSellerListingsForWowAccountController,
    saveSellerListingController,
    updateSellerListingController,
    updateSellerListingTimestampsController
} from "../controllers/sellerListingsControllers";


// Basic Listings CRUD
app.post("/seller_listings", ensureAuthenticated, saveSellerListingController);
app.put("/seller_listings/:id", ensureAuthenticated, updateSellerListingController);
app.delete("/seller_listings/:id", ensureAuthenticated, deleteSellerListingController);

// Other
app.get("/:region/seller_listings", ensureAuthenticated, getSellerListingsForWowAccountController);
app.get("/:region/:realm/seller_listings", getSellerListingsForRealmController);
app.get("/:region/:realm/seller_listings/item/:id", getSellerListingsForItemController);
app.get("/:region/seller_listings/ping", ensureAuthenticated, updateSellerListingTimestampsController);