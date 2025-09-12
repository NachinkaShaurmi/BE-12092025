export declare class User {
    id: string;
    login: string;
    password: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<User>);
}
