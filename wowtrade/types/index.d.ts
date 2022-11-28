export {};

declare global {
    interface Window {
        $WowheadPower: WowheadPower;
    }
}

class WowheadPower {
    constructor() {
        this.init();
    }

    refreshLinks(): void;
}