import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Col, Form, Row } from "react-bootstrap";

export default function Home() {

    return (
        <div className={styles.container}>
            <Head>
                <title>WoW Trade</title>
                <meta name="description" content="Trading site for high-quality World of Warcraft work orders."/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <Form>
                    <Row>
                        <Col md={6}><Form.Group>
                            <Form.Label>Region</Form.Label>
                            <Form.Control as="select">
                                <option>en</option>
                                <option>eu</option>
                            </Form.Control>
                        </Form.Group></Col>
                        <Col md={6}><Form.Group>
                            <Form.Label>Server</Form.Label>
                            <Form.Control as="select">
                                <option>en</option>
                                <option>eu</option>
                            </Form.Control>
                        </Form.Group></Col>
                    </Row>
                </Form>
            </main>
        </div>
    )
}
