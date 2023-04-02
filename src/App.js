import "./App.css";

import   React                                                        from "react";
import   OpenStreetMap                                                from "./components/OpenStreetMap";
import   Container                                                    from "react-bootstrap/Container";
import   Thread                                                       from "./components/Thread";
import   ResizeHandle                                                 from "./components/ResizeHandle";
import { Button, Form, InputGroup }                                   from "react-bootstrap";
import { useState, useEffect }                                        from "react";
import { Row, Col }                                                   from "react-bootstrap";
import { Panel, PanelGroup, PanelResizeHandle }                       from "react-resizable-panels";
import { fetchParentItems, fetchChildItems, getPosition, createPost } from "./helpers/Api";
import { RiFilter3Fill, RiFilterFill } from "react-icons/ri";

const OurSidebarCreate = ({ lastMapClick, switchToOverview, switchToDetail }) => {
    const [customLocEnab, setCustomLocEnab] = useState(false);
    const [text, setText]                   = useState("");
    const  onLocationToggleClick            = (useLocal) => setCustomLocEnab(!useLocal);
    const  onFormSubmit                     = () => {
        let promise = null;
        if (!customLocEnab)
        {
            promise = getPosition()
                .then((pos) => [pos.coords.latitude, pos.coords.longitude])
                .then((pos) => createPost(text, pos, "local"))
        }
        else
        {
            promise = createPost(text, lastMapClick, "remote");
        }

        promise.then(() => switchToOverview());
        promise.catch((err) => console.error("Failed to post:", err));
    };

    return (
        <Container fluid className="h-100 p-5">
            <Row className="h-100 align-items-center">
                <Col>
                    <Form>
                        {/* Text */}
                        <Form.Group controlId="create-form-text" className="mb-3">
                            <Form.Label className="text-muted">Text</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="What do you want to post about?"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </Form.Group>

                        {/* Location Toggle */}
                        <Form.Group controlId="create-form-location-toggle" className="mb-3">
                            <Form.Label className="text-muted">Range</Form.Label>
                            <Row>
                                <Form.Check
                                    inline
                                    label="Local"
                                    name="location-group"
                                    type="radio"
                                    id="location-group-local"
                                    onClick={(e) => onLocationToggleClick(true)}
                                    checked={!customLocEnab}
                                    readOnly
                                />
                                <Form.Check
                                    inline
                                    label="Remote"
                                    name="location-group"
                                    type="radio"
                                    id="location-group-remote"
                                    onClick={(e) => onLocationToggleClick(false)}
                                    checked={customLocEnab}
                                    readOnly
                                />
                            </Row>
                        </Form.Group>

                        {/* Remote Location */}
                        <Form.Group controlId="create-form-custom-location" className="mb-3">
                            <Form.Label className="text-muted">Custom Location</Form.Label>
                            <Form.Control
                                type="number"
                                disabled={!customLocEnab}
                                className="mb-2"
                                value={customLocEnab ? lastMapClick[0] : 0}
                                readOnly
                            />
                            <Form.Control
                                type="number"
                                disabled={!customLocEnab}
                                value={customLocEnab ? lastMapClick[1] : 0}
                                readOnly
                            />
                            <Form.Text className="text-muted">
                                Click on the map to select a custom location
                            </Form.Text>
                        </Form.Group>

                        {/* Buttons */}
                        <InputGroup>
                            <Button
                                variant="primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onFormSubmit();
                                }}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="danger"
                                onClick={(e) => {
                                    e.preventDefault();
                                    switchToOverview();
                                }}
                            >
                                Cancel
                            </Button>
                        </InputGroup>

                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

const makeSidebarOverview = (parentItems, switchToCreate) => {
    const onCreateButtonClick = (e) => {
        e.preventDefault();
        switchToCreate();
    };

    return (
        <Container fluid className="h-100 px-2">
            <Row className="h-100 text-center align-items-center">
                <Col>
                    <h1>worldsquare</h1>
                    <p>Click any pin to start</p>
                    <Button onClick={onCreateButtonClick}>Create a new post</Button>
                </Col>
            </Row>
        </Container>
    );
};

const makeSidebarDetail = (parentItem, childItems, onRequestRefresh, onRequestReturn) => {
    return (
        <div>
            <Thread
                parentItem={parentItem}
                childItems={childItems}
                onRequestRefresh={onRequestRefresh}
                onRequestReturn={onRequestReturn}
            />
        </div>
    );
};

function App() {
    const [isOverview, setIsOverview]     = useState(true);
    const [isCreateView, setIsCreateView] = useState(false);
    const [lastMapClick, setLastMapClick] = useState([0, 0]);
    const [parentItems, setParentItems]   = useState([]);
    const [childItems, setChildItems]     = useState([]);

    const switchToOverview = () => {
        fetchParentItems()
            .then((parItems) => {

                setIsCreateView(false);
                setIsOverview(true);
                setParentItems(parItems);
                setChildItems([]);

            })
            .catch((e) => console.error(e));
    };

    const switchToDetail = (parentPin) => {
        fetchChildItems(parentPin._id)
            .then((childItems) => {

                setIsCreateView(false);
                setIsOverview(false);
                setParentItems([parentPin]);
                setChildItems(childItems);

            })
            .catch((e) => console.error(e));
    };

    useEffect(switchToOverview, []);
    
    const switchToCreate = () => {
        setIsCreateView(true);
        setIsOverview(false);
        setParentItems([]);
        setChildItems([]);
    }

    const isDetailView   = parentItems.length === 1;

    const onPinClick = (pinId) => {
        let parentId = parentItems.find((item) => item._id === pinId);
        if (parentId)
        {
            if (isDetailView)
                switchToOverview();
            if (isOverview)
                switchToDetail(parentId);
            // You shouldn't be able to click a pin in the create view.
        }
    };

    const onMapClick = (latlng) => setLastMapClick([latlng.lat, latlng.lng]);

    return (
        <PanelGroup className="App" direction="horizontal">

            {/* Map */}
            <Panel className="Map" defaultSize={70}>
                <OpenStreetMap
                    parentPins={parentItems}
                    childPins={childItems}
                    onMapClick={onMapClick}
                    onPinClick={onPinClick}
                />
            </Panel>

            {/* Resize */}
            <ResizeHandle className="app-resize-handle" />

            {/* Sidebar */}
            <Panel className="app-sidebar" minSize={30}>
                {isCreateView && <OurSidebarCreate
                    lastMapClick={lastMapClick}
                    switchToOverview={switchToOverview}
                    switchToDetail={switchToDetail}
                />}
                {isOverview && makeSidebarOverview(parentItems, switchToCreate)}
                {isDetailView && makeSidebarDetail(parentItems[0], childItems, () => switchToDetail(parentItems[0]), switchToOverview)}
            </Panel>

            {/* FAB */}
            <div class="fab-container">
                <Button variant="primary">
                    <RiFilterFill />
                </Button>
            </div>

        </PanelGroup>
    );
}

export default App;
