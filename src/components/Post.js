import { Card, Badge } from "react-bootstrap";

function Post({ title, variant }) {
    return (
        <Card className="mt-2 mb-2">
            <Card.Header>
                <Badge>{variant}</Badge>
            </Card.Header>
            <Card.Body>{title}</Card.Body>
        </Card>
        // <div>
        //     <p className="post">
        //         {title}
        //         <div>
        //             <span className="variant">{variant}</span>
        //         </div>
        //     </p>
        // </div>
    );
}

export default Post;
