"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tstl = __importStar(require("typescript-to-lua"));
const ts = __importStar(require("typescript"));
const lua = __importStar(require("typescript-to-lua"));
const typescript_1 = require("typescript-to-lua/dist/transformation/utils/typescript");
const lualib_1 = require("typescript-to-lua/dist/transformation/utils/lualib");
const lua_ast_1 = require("typescript-to-lua/dist/transformation/utils/lua-ast");
function default_1(options) {
    void options;
    return {
        visitors: {
            [ts.SyntaxKind.SpreadElement]: (node, context) => {
                var _a;
                const type = context.checker.getTypeAtLocation(node.expression);
                if (typescript_1.isArrayType(context, type) && ((_a = type.aliasSymbol) === null || _a === void 0 ? void 0 : _a.escapedName) == "UserDataArray") {
                    const innerExpression = context.transformExpression(node.expression);
                    const x = tstl.createIdentifier("x");
                    const self = tstl.createIdentifier("___");
                    const mapFunction = lua.createFunctionExpression(tstl.createBlock([tstl.createReturnStatement([lua.cloneIdentifier(x)])]), [self, x], undefined, tstl.FunctionExpressionFlags.Inline);
                    const map = lualib_1.transformLuaLibFunction(context, lualib_1.LuaLibFeature.ArrayMap, node, innerExpression, ...[mapFunction]);
                    return lua_ast_1.createUnpackCall(context, map, node);
                }
                return context.superTransformExpression(node);
            },
        },
    };
}
exports.default = default_1;
