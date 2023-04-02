import { Card } from "react-bootstrap";

function Comment({ message, timestamp, distance }) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    const formattedTime = month + "/" + day + "/" + year + " " + hours + ':' + minutes.substr(-2);

    let dist = Math.round(distance, 1).toFixed(1);
    if (dist < 0.1) {
        dist = "<0.1";
    }

    return (
        <div>
            <div className="post mb-1 p-1" id="comment">
                <div className="color-region"></div>
                <div className="message-container p-1">
                    <p>{message}</p>
                </div>
                <div className="timestamp-dist-container">
                    <div className="distance-container">
                        {dist} km away
                    </div>
                    <div className="timestamp-container">
                        {formattedTime}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Comment;
