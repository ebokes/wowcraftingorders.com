import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import ListingsList from "../../components/ListingsList";
import { useContext } from "react";
import { RegionRealmContext } from "../_app";
import { SetRegionRealmView } from "../../components/SetRealms";

export default function itemPage() {

    // Hooks
    const context = useContext(RegionRealmContext);
    const router = useRouter();
    let { itemID } = router.query;
    const { data: listings, error } = useSWR(`/item/${itemID}`);

    // Router doesn't generally update until after the first render, so null check is necessary
    if (!itemID) return <Image width="30" height="30" alt="Loading" src={"/loading.gif"}/>

    return <div>
        <SetRegionRealmView/>
        {context.region && context.realm &&
            <h3 className={"mt-3"}>Listings on {context.region.toUpperCase()} {context.realm}</h3>}
        <ListingsList listings={listings} error={error}/>
    </div>
}