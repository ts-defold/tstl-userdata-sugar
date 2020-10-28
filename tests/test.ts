declare type LuaUserdata = {
    readonly __internal__: never;
};

declare type UserDataArray<T> = Array<T> & LuaUserdata & {
};

declare function makeUserData(): UserDataArray<number>;

const userData: UserDataArray<number> = makeUserData();
console.log([...userData]);
