export interface BattleNetProfileDataResponse {
    _links: {
        self: {
            href: string;
        }
        user: {
            href: string;
        }
        profile: {
            href: string;
        }
    },
    id: number,
    wow_accounts: Account[];
    collections: {
        href: string;
    }
}

interface Account {
    id: number;
    characters: BNetCharacter[];
}

export interface BNetCharacter {
    character: {
        href: string;
    };
    protected_character: {
        href: string;
    }
    name: string;
    id: number;
    realm: {
        key: {
            href: string;
        }
        name: string;
        id: number;
        slug: string;
    }
    playable_class: {
        key: {
            href: string;
        }
        name: string;
        id: number;
    }
    gender: {
        type: string;
        name: string;
    }
    faction: {
        type: string;
        name: string;
    }
    level: number;
}
