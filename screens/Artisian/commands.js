export const voiceCommands = {
    // Navigation commands
    'add product': {
      action: 'navigation',
      route: 'AddProduct',
      response: 'Opening add product page'
    },
    'view orders': {
      action: 'navigation',
      route: 'Orders',
      response: 'Showing your orders'
    },
    
    // Help commands
    'how to add product': {
      action: 'help',
      response: 'To add a product, tap the plus button at the bottom of the screen. Then fill in your product details and upload photos.'
    },
    
    // Status queries
    'show earnings': {
      action: 'query',
      route: 'Earnings',
      response: 'Opening your earnings page'
    }
  };