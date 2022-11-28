import useSWR from "swr";
import { Listing } from "../pages/types";
import Script from "next/script";

interface Props {
    region: string;
    realm: string;
}

export default function ListingsList({ region, realm }: Props) {
    const { data, error } = useSWR(`/${region}/${realm}/items`);
    if (error) return <div>Failed to load listings. Please try and refresh the page.</div>
    if (!data) return <div>Loading...</div>
    return <div>
        <ul>
            {data.map((listing: Listing) => (
                <li key={listing.itemId}>
                    <ul>
                        <li>
                            <span>Item: <a href={`https://www.wowhead.com/item=${listing.itemId}`}>Link Text</a></span>
                        </li>
                        <li>
                            <span>Commission: {`${listing.commission.gold}g ${listing.commission.silver}s ${listing.commission.copper}c`}</span>
                        </li>
                    </ul>
                </li>
            ))}
        </ul>
        {data && <Script type="text/javascript"
                         strategy="afterInteractive">{`window.$WowheadPower.refreshLinks();`}</Script>}
    </div>
}