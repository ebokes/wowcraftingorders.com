import useSWR from "swr";
import { Listing } from "../pages/types";
import Link from "next/link";

interface Props {
    region: string;
    realm: string;
}

export default function ListingsList({ region, realm }: Props) {
    const { data, error } = useSWR(`/${region}/${realm}/items`);
    if (error) return <div>Failed to load listings. Please try and refresh the page.</div>
    if (!data) return <div>Loading...</div>
    return <ul>
        {data.map((listing: Listing) => (
            <li>
                <ul>
                    <li>
                        <span>Item:</span>
                        <Link href={`https://www.wowhead.com/item=${listing.itemId}/`}></Link>
                    </li>
                    <li>
                        <span>Commission: {`${listing.commission.gold}g ${listing.commission.silver}s ${listing.commission.copper}c`}</span>
                    </li>
                </ul>
            </li>
        ))}
    </ul>
}