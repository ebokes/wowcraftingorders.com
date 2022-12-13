/**
 * This file is the selectable reagents component, which shows up whenever someone selects an item
 * when creating the listing.
 */

import { Col, Form, ListGroup, Row } from "react-bootstrap";
import { ITEMS } from "../data/items";
import Link from "next/link";
import { BuyerListingPayload, Reagent, ReagentStack, SellerListingPayload } from "../types/types";
import { RegionRealmTypeContext } from "../pages/_app";
import { useContext } from "react";
import { SELLER } from "./SetRealms";
import { INFUSIONS } from "../data/reagents/infusions";

interface Props {
    payload: BuyerListingPayload | SellerListingPayload;
    setPayload: (listing: BuyerListingPayload | SellerListingPayload) => void
}

export const ReagentsView = ({ payload, setPayload }: Props) => {
    const context = useContext(RegionRealmTypeContext);
    return <Row className={"mt-2"}>
        <Col md={context.type === SELLER ? 6 : 12}>
            <p className={"m-0"}>Recipe Materials</p>
            <Form.Text>Specify whether you can provide these, and how many.</Form.Text>
            <ListGroup>
                {ITEMS.find(item => item.id === payload.itemId)?.reagents.map(reagent => {
                    return <ListGroup.Item
                        key={reagent.reagent.itemId} style={{ position: "relative" }}>

                        {!reagent.reagent.buyerProvides &&
                            <span>
                                <Form.Check onChange={() => {
                                    payload.providedReagents.find((iterationReagent: ReagentStack) => iterationReagent.reagent.itemId === reagent.reagent.itemId)
                                        ? setPayload({
                                            ...payload,
                                            providedReagents: payload.providedReagents.filter((iterationReagent: ReagentStack) => iterationReagent.reagent.itemId !== reagent.reagent.itemId)
                                        }) : setPayload({
                                            ...payload,
                                            providedReagents: [
                                                ...payload.providedReagents,
                                                reagent
                                            ]
                                        })
                                }} type={"checkbox"} id={`reagent-${reagent.reagent.itemId}`} className="me-2"
                                            style={{ display: "inline" }}/>
                            </span>
                        }


                        <span>{reagent.count}{"x "}</span>

                        <Link
                            href={`https://www.wowhead.com/item=${reagent.reagent.itemId}`}></Link>
                        {!!reagent.reagent.buyerProvides &&
                            <span>{" (Buyer-Provided)"}</span>}

                        {!reagent.reagent.buyerProvides && payload.providedReagents.find((iterationReagent: ReagentStack) => iterationReagent.reagent.itemId === reagent.reagent.itemId) &&
                            <span style={{ position: "absolute", top: "0", right: "0" }}>
                                <span className={"ms-3"}>
                                    <span>Quality coming soon!</span>
                                </span>
                                <span className={"ms-3"}>
                                    <span>Amount: </span>
                                    <Form.Control type="number"
                                                  value={payload.providedReagents.find((iterationReagent: ReagentStack) => iterationReagent.reagent.itemId === reagent.reagent.itemId)?.count}
                                                  onChange={(e) => {
                                                      setPayload({
                                                          ...payload,
                                                          providedReagents: payload.providedReagents.map((iterationReagent: ReagentStack) => {
                                                              if (iterationReagent.reagent.itemId === reagent.reagent.itemId) {
                                                                  return {
                                                                      ...iterationReagent,
                                                                      count: parseInt(e.target.value)
                                                                  }
                                                              }
                                                              return iterationReagent;
                                                          })
                                                      })
                                                  }}
                                                  style={{ display: "inline", width: "100px" }}/>
                                </span>
                            </span>
                        }

                    </ListGroup.Item>
                })}
            </ListGroup>
        </Col>
        {context.type === SELLER && (payload as SellerListingPayload).infusions &&
            <Col md={6}>
                <Form.Group>
                    <p className={"m-0"}>Infusions</p>
                    <Form.Text muted>Check the box if you can use it in your crafts!</Form.Text>
                    <ListGroup>
                        {INFUSIONS.map((infusion) => {
                            return <ListGroup.Item key={infusion.itemId}>
                                <Form.Check onChange={() => {
                                    (payload as SellerListingPayload).infusions.find((iterationInfusion: Reagent) => iterationInfusion.itemId === infusion.itemId)
                                        ? setPayload({
                                            ...payload,
                                            infusions: (payload as SellerListingPayload).infusions.filter((iterationInfusion: Reagent) => iterationInfusion.itemId !== infusion.itemId)
                                        }) : setPayload({
                                            ...payload,
                                            infusions: [
                                                ...(payload as SellerListingPayload).infusions,
                                                infusion
                                            ]
                                        })
                                }} checked={!!(payload as SellerListingPayload).infusions.find(
                                    (iterationInfusion: Reagent) => iterationInfusion.itemId === infusion.itemId)}
                                            type={"checkbox"} className="me-2"
                                            style={{ display: "inline" }}/>
                                <Link
                                    href={`https://www.wowhead.com/item=${infusion.itemId}`}></Link>
                            </ListGroup.Item>
                        })}
                    </ListGroup>
                </Form.Group>
            </Col>}
    </Row>
}