import { DivIcon } from 'leaflet';
import { useEffect } from 'react';
import { TileLayer, MapContainer, Marker, Polyline, useMapEvent, useMap } from 'react-leaflet';
import { renderToStaticMarkup } from 'react-dom/server'
import { FaMapMarkerAlt } from 'react-icons/fa';

// Constants
const defaultCenter = [0, 0];
const defaultZoom = 12;

// Methods
const createMarkerIcon = (variant) => {
    return new DivIcon({
        html: renderToStaticMarkup(
            <FaMapMarkerAlt 
                size={24} 
                color={(variant==="local") ? 'green' : 'black'} 
            />
        ),
        iconAnchor: [12, 24],
        className: 'dummy'

    });
}

// Components
const PinComponent = ({ id, location, variant, onClick }) => {
    return (
        <Marker
            position={location}
            eventHandlers={{ click: () => onClick ? onClick(id) : null }}
            icon={createMarkerIcon(variant)}
        />
    );
};

const MoveToUserOnLoadComponent = () => {
    const map = useMap();
    useEffect(() => {

        map.locate().on('locationfound', (e) => {
            console.log("Initial user position acquired");
            map.flyTo(e.latlng, 12);
        });

        // eslint-disable-next-line
    }, []);
    return null;
};

const OnMapClickComponent = ({ onMapClick }) => {
    useMapEvent('click', (e) => onMapClick ? onMapClick(e.latlng) : null);
    return null;
};

const VectorLayerComponent = ({ parentPin, childPins }) => {
    return childPins.map((childPin) => (
        <Polyline
            // This is to appease the warning about every item in a list needing a unique key.
            key={`${parentPin._id}-${childPin._id}`}

            pathOptions={{ color: 'black', weight: 2 }}
            positions={[parentPin.location, childPin.location]}
        />
    ));
};

const ShowPinsComponent = ({ parentPins, childPins, onPinClick }) => {
    const makePinFromPin = (pin) => (
        <PinComponent
            // This is to appease the warning about every item in a list needing a unique key.
            key={pin._id}
            variant={pin.variant}
            id={pin._id}
            location={pin.location}
            onClick={onPinClick}
        />
    );

    return (
        <div>
            {parentPins.map(makePinFromPin)}
            {childPins.map(makePinFromPin)}
        </div>
    );
};

const OpenStreetMap = ({ parentPins, childPins, onPinClick, onMapClick }) => {
    // Pin should be of form { id: string, latlng: [number, number] }.
    return (
        <MapContainer center={defaultCenter} zoom={defaultZoom} doubleClickZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MoveToUserOnLoadComponent />
            <OnMapClickComponent onMapClick={onMapClick} />
            <ShowPinsComponent parentPins={parentPins} childPins={childPins} onPinClick={onPinClick} />
            {(parentPins.length === 1) && <VectorLayerComponent parentPin={parentPins[0]} childPins={childPins} />}
        </MapContainer>
    );
};

export default OpenStreetMap;
