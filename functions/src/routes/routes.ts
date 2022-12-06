import { ensureAuthenticated } from "../middleware";
import { app } from "../index";
import {
    deleteSellerListingController,
    getSellerListingsForItemController,
    getSellerListingsForRealmController,
    getSellerListingsForWowAccountController,
    saveSellerListingController,
    updateListingTimestampsController,
    updateSellerListingController
} from "../controllers/sellerListingsControllers";


// Basic Listings CRUD
app.post("/listings", ensureAuthenticated, saveSellerListingController);
app.put("/listings/:id", ensureAuthenticated, updateSellerListingController);
app.delete("/listings/:id", ensureAuthenticated, deleteSellerListingController);

// Other
app.get("/:region/listings", ensureAuthenticated, getSellerListingsForWowAccountController);
app.get("/:region/:realm/items", getSellerListingsForRealmController);
app.get("/:region/:realm/item/:id", getSellerListingsForItemController);
app.get("/:region/ping", ensureAuthenticated, updateListingTimestampsController);