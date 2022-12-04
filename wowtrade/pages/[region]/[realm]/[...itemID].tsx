import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import ListingsList from "../../../components/ListingsList";

export default function itemPage() {

    // Hooks
    const router = useRouter();
    let { region, realm, itemID } = router.query;

    // TODO: This is a hacky workaround for me needing to use ...itemID in the path. Find a cleaner way to do it.
    if (itemID != null) { // Hacky workaround for me not being able to get
        itemID = itemID[1];
    }
    region = region as string; // TODO: Hacky, needs fix. Necessary so that Webstorm stops yelling at me for the later .toUpperCase()
    const { data: listings, error } = useSWR(`/${region}/${realm}/item/${itemID}`);

    // Conditionally not rendering
    if (!region || !realm || !itemID) return <Image width="30" height="30" alt="Loading" src={"/loading.gif"}/>
    if (error) {
        return <div>Failed to load listings for this item. Please try and refresh the page.</div>
    }

    return <div>
        <div className={"mt-5"}></div>
        {region && realm && <h3 className={"mt-3"}>Listings on {region.toUpperCase()} {realm}</h3>}
        <ListingsList listings={listings} error={error}/>
    </div>
}