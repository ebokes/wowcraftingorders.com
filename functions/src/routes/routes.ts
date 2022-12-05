import { ensureAuthenticated } from "../middleware";
import { app } from "../index";
import {
    deleteListingController,
    getItemsForRealmController,
    getListingsForItemController,
    getListingsForWowAccountController,
    saveListingController,
    updateListingController,
    updateListingTimestampsController
} from "../controllers/controllers";


// Basic Listings CRUD
app.post("/listings", ensureAuthenticated, saveListingController);
app.put("/listings/:id", ensureAuthenticated, updateListingController);
app.delete("/listings/:id", ensureAuthenticated, deleteListingController);

// Other
app.get("/:region/listings", ensureAuthenticated, getListingsForWowAccountController);
app.get("/:region/:realm/items", getItemsForRealmController);
app.get("/:region/:realm/item/:id", getListingsForItemController);
app.get("/:region/ping", ensureAuthenticated, updateListingTimestampsController);