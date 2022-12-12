import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import ListingsList from "../../components/ListingsList";
import { useContext } from "react";
import { RegionRealmTypeContext } from "../_app";
import { SetRegionRealmType } from "../../components/SetRealms";
import Link from "next/link";
import { ITEMS } from "../../data/items";

export default function itemPage() {

    // Hooks
    const context = useContext(RegionRealmTypeContext);
    const router = useRouter();
    let { itemID } = router.query;

    const { data: listings, error } = useSWR(`/${context.region}/${context.realm}/${context.type}/item/${itemID}`);

    // Router doesn't generally update until after the first render, so null check is necessary
    if (!itemID) return <Image width="30" height="30" alt="Loading" src={"/loading.gif"}/>

    const item = ITEMS.find(item => item.id === parseInt(itemID as string));
    if (!item) return <div>That item does not exist.</div>

    return <div>
        <h3 className={"mt-5"}>Listings for <Link href={`https://www.wowhead.com/item=${itemID}`}>${item.name}</Link>
        </h3>
        <SetRegionRealmType/>
        <ListingsList type={context.type} listings={listings} error={error} includeDelete={false}/>
    </div>
}