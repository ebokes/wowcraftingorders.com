import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import ListingsList from "../../components/ListingsList";
import { useContext } from "react";
import { RegionRealmContext } from "../_app";
import { SetRegionRealmView } from "../../components/SetRealms";
import Link from "next/link";

export default function itemPage() {

    // Hooks
    const context = useContext(RegionRealmContext);
    const router = useRouter();
    let { itemID } = router.query;
    const { data: listings, error } = useSWR(`/${context.region}/${context.realm}/item/${itemID}`);

    // Router doesn't generally update until after the first render, so null check is necessary
    if (!itemID) return <Image width="30" height="30" alt="Loading" src={"/loading.gif"}/>

    return <div>
        {context.region && context.realm &&
            <h3 className={"mt-3"}>Listings for <Link href={`https://www.wowhead.com/item=${itemID}`}>Loading
                Tooltip...</Link></h3>}
        <SetRegionRealmView/>
        <ListingsList listings={listings} error={error} includeDelete={false}/>
    </div>
}