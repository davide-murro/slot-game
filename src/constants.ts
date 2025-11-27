export const REEL_SYMBOLS: string[] = [
    // This is the full, massive strip provided in your prompt
    'SYM1', 'SYM5', 'SYM1', 'SYM3', 'SYM4', 'SYM3', 'SYM2', 'SYM4', 'SYM3', 'SYM6', 'SYM3', 'SYM1', 'SYM6', 'SYM1', 'SYM2', 'SYM1', 'SYM2', 'SYM2', 'SYM2', 'SYM1', 'SYM2', 'SYM1', 'SYM4', 'SYM1', 'SYM3', 'SYM6', 'SYM1', 'SYM3', 'SYM2', 'SYM5', 'SYM3', 'SYM1', 'SYM2', 'SYM2', 'SYM2', 'SYM1', 'SYM4', 'SYM1', 'SYM4', 'SYM1', 'SYM3', 'SYM2', 'SYM4', 'SYM4', 'SYM5', 'SYM2', 'SYM3', 'SYM1', 'SYM1', 'SYM1', 'SYM4', 'SYM5', 'SYM2', 'SYM2', 'SYM2', 'SYM1', 'SYM5', 'SYM6', 'SYM1', 'SYM3', 'SYM4', 'SYM2', 'SYM5', 'SYM2', 'SYM1', 'SYM5', 'SYM1', 'SYM2', 'SYM1', 'SYM1', 'SYM1', 'SYM4', 'SYM4', 'SYM3', 'SYM3', 'SYM5', 'SYM5', 'SYM4', 'SYM2', 'SYM5', 'SYM2', 'SYM1', 'SYM3', 'SYM2', 'SYM3', 'SYM1', 'SYM4', 'SYM3', 'SYM4', 'SYM2', 'SYM3', 'SYM4', 'SYM1', 'SYM1', 'SYM1', 'SYM2', 'SYM6', 'SYM3', 'SYM2', 'SYM3', 'SYM1', 'SYM5'
];

export const SYMBOL_ALIASES = ['sym01', 'sym02', 'sym03', 'sym04', 'sym05', 'sym06'];

// Map the SYM1, SYM2 etc. from the reel strip to the actual asset aliases
export const SYMBOL_TO_ALIAS: { [key: string]: string } = {
    'SYM1': 'sym01',
    'SYM2': 'sym02',
    'SYM3': 'sym03',
    'SYM4': 'sym04',
    'SYM5': 'sym05',
    'SYM6': 'sym06',
};

export const GAME_CONSTANTS = {
    INITIAL_BALANCE: 100,
    SPIN_PRICE: 1,
    VISIBLE_SYMBOLS: 3,
    SPIN_SPEED: 2,   // Pixels per frame
    NORMAL_SPIN_DURATION_MS: 3000,
};