import React from 'react';

const LocationSearchPanel = ({
  suggestions,
  setPickup,
  setDestination,
  activeField,
  setVehiclePanel,
  setPanelOpen,
}) => {

  const handleSuggestionClick = (suggestion) => {
    if (activeField === 'pickup') {
      setPickup(suggestion.name || suggestion);
    } else if (activeField === 'destination') {
      setDestination(suggestion.name || suggestion);
    }

    // setVehiclePanel(true);
    // setPanelOpen(false);
  };

  return (
    <div>
      {/* backend se aayi suggestions */}
      {suggestions.map((elem, idx) => (
        <div
          key={idx}
          onClick={() => handleSuggestionClick(elem)}
          className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 cursor-pointer"
        >
          <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full text-xl">
            <i className="ri-map-pin-fill"></i>
          </h2>

          <h4 className="font-medium">
            {elem.name || elem}
          </h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;