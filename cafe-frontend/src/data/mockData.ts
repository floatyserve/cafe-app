import type {MenuItem, Order} from '../types';

export const MOCK_MENU: MenuItem[] = [
    { id: 1, name: 'Espresso', category: 'DRINK', price: 2.50 },
    { id: 2, name: 'Latte', category: 'DRINK', price: 4.00 },
    { id: 3, name: 'Craft Beer', category: 'DRINK', price: 5.50 },
    { id: 4, name: 'Avocado Toast', category: 'MEAL', price: 8.50 },
    { id: 5, name: 'Club Sandwich', category: 'MEAL', price: 11.00 },
    { id: 6, name: 'Caesar Salad', category: 'MEAL', price: 9.00 },
    { id: 7, name: 'Cheesecake', category: 'DESSERT', price: 6.00 },
    { id: 8, name: 'Chocolate Croissant', category: 'DESSERT', price: 3.50 }
];

export const MOCK_ORDERS: Order[] = [
    {
        id: 101,
        tableNumber: 4,
        status: 'OPEN',
        createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
        items: [
            { id: 1, menuItem: MOCK_MENU[3], quantity: 2, notes: 'No tomatoes', status: 'PENDING' },
            { id: 2, menuItem: MOCK_MENU[4], quantity: 1, status: 'PREPARING' },
            { id: 3, menuItem: MOCK_MENU[0], quantity: 1, status: 'SERVED' }
        ]
    },
    {
        id: 102,
        tableNumber: 12,
        status: 'OPEN',
        createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
        items: [
            { id: 4, menuItem: MOCK_MENU[5], quantity: 1, notes: 'Dressing on the side', status: 'READY' },
            { id: 5, menuItem: MOCK_MENU[1], quantity: 2, status: 'READY' }
        ]
    },
    {
        id: 103,
        tableNumber: 7,
        status: 'OPEN',
        createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
        items: [
            { id: 6, menuItem: MOCK_MENU[6], quantity: 2, status: 'PENDING' },
            { id: 7, menuItem: MOCK_MENU[7], quantity: 1, status: 'PENDING' }
        ]
    },
    // --- THE LUNCH RUSH STARTS HERE ---
    {
        // Table 2: Huge group, just ordered. Kitchen is about to get hit hard.
        id: 104,
        tableNumber: 2,
        status: 'OPEN',
        createdAt: new Date(Date.now() - 4 * 60000).toISOString(), // 4 mins ago
        items: [
            { id: 8, menuItem: MOCK_MENU[3], quantity: 3, status: 'PENDING' },
            { id: 9, menuItem: MOCK_MENU[4], quantity: 2, notes: 'Gluten free bread for 1', status: 'PENDING' },
            { id: 10, menuItem: MOCK_MENU[5], quantity: 1, notes: 'No croutons, extra chicken', status: 'PENDING' },
            { id: 11, menuItem: MOCK_MENU[2], quantity: 4, status: 'PENDING' } // Beers for the table
        ]
    },
    {
        // Table 9: Drinks served, Kitchen is actively working on all meals.
        id: 105,
        tableNumber: 9,
        status: 'OPEN',
        createdAt: new Date(Date.now() - 18 * 60000).toISOString(), // 18 mins ago (getting slow!)
        items: [
            { id: 12, menuItem: MOCK_MENU[4], quantity: 1, status: 'PREPARING' }, // Club sandwich
            { id: 13, menuItem: MOCK_MENU[5], quantity: 1, status: 'PREPARING' }, // Caesar salad
            { id: 14, menuItem: MOCK_MENU[1], quantity: 2, notes: 'Oat milk, extra hot', status: 'SERVED' } // Lattes
        ]
    },
    {
        // Table 14: One item ready, waiting on the rest.
        id: 106,
        tableNumber: 14,
        status: 'OPEN',
        createdAt: new Date(Date.now() - 10 * 60000).toISOString(), // 10 mins ago
        items: [
            { id: 15, menuItem: MOCK_MENU[3], quantity: 1, status: 'READY' },     // Avo toast
            { id: 16, menuItem: MOCK_MENU[4], quantity: 1, status: 'PREPARING' }, // Club sandwich
            { id: 17, menuItem: MOCK_MENU[0], quantity: 2, status: 'SERVED' }     // Espresso
        ]
    },
    {
        // Table 5: People are eating. Everything is served, but table hasn't paid yet.
        // Kitchen shouldn't see this at all.
        id: 107,
        tableNumber: 5,
        status: 'OPEN',
        createdAt: new Date(Date.now() - 45 * 60000).toISOString(), // 45 mins ago
        items: [
            { id: 18, menuItem: MOCK_MENU[5], quantity: 2, status: 'SERVED' },
            { id: 19, menuItem: MOCK_MENU[2], quantity: 2, status: 'SERVED' }
        ]
    },
    {
        // Table 1: Quick solo lunch, everything is ready at the pass.
        id: 108,
        tableNumber: 1,
        status: 'OPEN',
        createdAt: new Date(Date.now() - 8 * 60000).toISOString(), // 8 mins ago
        items: [
            { id: 20, menuItem: MOCK_MENU[4], quantity: 1, notes: 'No mayo', status: 'READY' },
            { id: 21, menuItem: MOCK_MENU[7], quantity: 1, status: 'READY' }
        ]
    }
];