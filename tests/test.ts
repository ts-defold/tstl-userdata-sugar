/// <reference types="../lib" />

declare function makeUserData(): UserDataArray<number>;

const userData: UserDataArray<number> = makeUserData();
console.log([...userData]);
