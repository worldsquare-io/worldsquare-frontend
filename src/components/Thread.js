import Post from "./Post";
import Comment from "./Comment";
import React from 'react';
import { useState } from "react";
import { RiArrowLeftFill, RiSendPlaneFill } from "react-icons/ri";
import { postComment } from "../helpers/Api";
import { Container, Form, ListGroup } from "react-bootstrap";
import { InputGroup, Button } from "react-bootstrap";

function Thread({ parentItem, childItems, onRequestRefresh, onRequestReturn }) {
    let title = parentItem.message;
    let variant = parentItem.variant;
    const [text, setText] = useState("");

    function handleInputMessage(e) {
        e.preventDefault();

        postComment(parentItem._id, text)
            .then(() => onRequestRefresh())
            .catch((err) => console.err("Failed to post comment:", err));

        setText("");
    }

    return (
        // <div className="thread-container">
        <Container className="ThreadContainer p-2">
            {/* This is where the post and comments are displayed. */}
            {/* <div className="post-comment-container"> */}
            <Container className="PostCommentContainer mb-3">
                <Post title={title} variant={variant} />
                {/* <div className="comment-container"> */}
                    {childItems.map((item) =>
                        <Comment
                            key={item._id}
                            message={item.message}
                            timestamp={item.timestamp}
                            distance={item.distance}
                        />)}
                {/* </div> */}
            </Container>
            {/* </div> */}

            {/* This is where the user can input a comment. */}
            {/* <form className="comment-input-container" onSubmit={handleInputMessage}> */}
            <Form className="CommentInputContainer" onSubmit={handleInputMessage}>
                {/* <label>
                    <input
                        type="text"
                        name="comment"
                        value={text}
                        placeholder="Enter a comment"
                        className="comment-input"
                        onChange={e => setText(e.target.value)}
                    />
                </label> */}
                <Form.Group>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Make a reply"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            className="mb-3"
                        />

                        <div className="input-group-append">
                            <Button variant="primary" onClick={handleInputMessage} className="mx-1">
                                <RiSendPlaneFill />
                            </Button>
                            <Button variant="danger" onClick={(e) => onRequestReturn()}>
                                <RiArrowLeftFill />
                            </Button>
                        </div>
                    </InputGroup>
                </Form.Group>
            </Form>
            {/* </form> */}
        </Container>
        // </div>
    );
}

export default Thread;
