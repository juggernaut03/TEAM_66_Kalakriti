export const offlineResponses = {
    addProduct: "To add a product, tap the plus button at the bottom of the screen.",
    viewOrders: "Your orders can be found in the Orders tab at the bottom.",
    checkEarnings: "To check your earnings, go to the Earnings section.",
    help: "You can find help by tapping the help button or calling support.",
  };
  
  export const getOfflineResponse = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('add product')) return offlineResponses.addProduct;
    if (lowerText.includes('orders')) return offlineResponses.viewOrders;
    if (lowerText.includes('earnings')) return offlineResponses.checkEarnings;
    if (lowerText.includes('help')) return offlineResponses.help;
    
    return "I'm currently offline. Please check your internet connection to use all features.";
  };