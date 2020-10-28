# tstl-userdata-sugar
<a href="https://discord.gg/eukcq5m"><img alt="Chat with us!" src="https://img.shields.io/discord/766898804896038942.svg?colorB=7581dc&logo=discord&logoColor=white"></a>
> TypeScriptToLua plugin that provides syntax sugar for Userdata types in lua

## Features

### `...` => unpack
Support array-like user data object destructuring.
> Lua's `unpack` function only supports unpacking tables, even if the required metamethods of `__index` and `__len` are present to treat them like an array.

To support this feature we detect a `...` of an `Array<T>` & `LuaUserdata` type and implicitly inject a call to `map(x => x)`. This then returns a table from the userdata and passes it to unpack. There may exist more efficient methods of unpacking your array data directly from the userdata type, and you may want to avoid this syntax sugar if moving large amounts of data.

```ts
declare type UserDataArray<T> = Array<T> & LuaUserdata & {
};

declare function makeUserData(): UserDataArray<number>;

const userData: UserDataArray<number> = makeUserData();
console.log([...userData]);
```
