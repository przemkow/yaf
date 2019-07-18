function updateVNodeProps(dom, prevProps, nextProps) {
  prevProps.on = prevProps.on || {};
  prevProps.attributes = prevProps.attributes || {};

  // Remove events
  const eventsToRemove = Object.keys(prevProps.on)
    .reduce((acc, prevPropKey) => {
      return nextProps.on[prevPropKey] && prevProps.on[prevPropKey].toString() === nextProps.on[prevPropKey].toString() ? acc : [...acc, prevPropKey]
    }, [])

  for(let eventName of eventsToRemove) {
    dom.removeEventListener(eventName, prevProps.on[eventName]);
  }
  
  // Remove attributes
  const attributesToRemove = Object.keys(prevProps.attributes)
    .reduce((acc, prevPropKey) => prevProps.attributes[prevPropKey] === nextProps.attributes[prevPropKey] ? 
      acc : [...acc, prevPropKey], 
    [])
  for(let attributeName of attributesToRemove) {
    dom[attributeName] = null;
  }

  // Add event listeners
  const eventsToAdd = Object.keys(nextProps.on)
    .reduce((acc, nextPropKey) => {
      return prevProps.on[nextPropKey] && prevProps.on[nextPropKey].toString() === nextProps.on[nextPropKey].toString() ? acc : [...acc, nextPropKey]
    }, [])
  for(let eventName of eventsToAdd) {
    dom.addEventListener(eventName, nextProps.on[eventName]);
  }
  
    
  // Set attributes
  const attributesToAdd = Object.keys(nextProps.attributes)
    .reduce((acc, nextPropKey) => prevProps.attributes[nextPropKey] === nextProps.attributes[nextPropKey] ? 
      acc : [...acc, nextPropKey], 
    [])
  for(let attributeName of attributesToAdd) {
    dom[attributeName] = nextProps.attributes[attributeName];
  }
}

export {
  updateVNodeProps
}