/** @noSelfInFile */
// tstl-userdata-sugar
// =^..^=   =^..^=   =^..^=    =^..^=    =^..^=    =^..^=    =^..^= //
declare enum UserDataBrand { _ = "" }

declare type UserDataArray<T> = Array<T> & UserDataBrand & {
};
