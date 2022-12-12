import { BuyerListingPayload, SellerListingPayload } from "../types/types";
import { ITEMS } from "../data/items";
import ReactSelect from "react-select";

interface Props {
    payload: SellerListingPayload | BuyerListingPayload;
    setPayload: (payload: SellerListingPayload | BuyerListingPayload) => void;
}

export const ItemSelectView = ({ payload, setPayload }: Props) => {
    return <ReactSelect
        styles={{
            control: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "rgb(20, 25, 30)",

            }),
            dropdownIndicator: (baseStyles) => ({
                ...baseStyles,
                color: "white"
            }),
            option: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "rgb(20, 25, 30)",
                color: "white",
                ":hover": {
                    backgroundColor: "rgb(40, 45, 50)",
                }
            }),
            menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "rgb(20, 25, 30)"
            }),
            singleValue: (baseStyles) => ({
                ...baseStyles,
                color: "white"
            }),
        }}
        defaultValue={{ value: -1, label: "No Item Selected" }}
        onChange={(newValue) => {
            if (!newValue) return;
            setPayload({ ...payload, itemId: newValue.value })
        }} options={[...ITEMS]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(item => {
            return {
                value: item.id,
                label: item.name
            }
        })
        .concat([{ value: -1, label: "No Item Selected" }])
    }/>
}