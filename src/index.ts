import * as tstl from "typescript-to-lua";
import * as ts from "typescript";
import * as lua from "typescript-to-lua";
import { isArrayType } from "typescript-to-lua/dist/transformation/utils/typescript";
import { LuaLibFeature, transformLuaLibFunction } from "typescript-to-lua/dist/transformation/utils/lualib";
import { createUnpackCall } from "typescript-to-lua/dist/transformation/utils/lua-ast";

interface PluginOptions {
  name: string
}

function isLuaUserData(type: ts.Type): boolean {
  if (type.aliasSymbol && type.aliasSymbol.declarations.length) {
    const typeDecl = type.aliasSymbol.declarations[0];
    if (ts.isTypeAliasDeclaration(typeDecl)) {
      const typeAlias = typeDecl as ts.TypeAliasDeclaration;
      if (ts.isIntersectionTypeNode(typeAlias.type)) {
        const typeIntersection = typeAlias.type as ts.IntersectionTypeNode;
        const luaUserData = typeIntersection.types.find(t => {
          if (ts.isTypeReferenceNode(t)) {
            const typeName = (t as ts.TypeReferenceNode).typeName;
            return ts.isIdentifier(typeName) && (typeName as ts.Identifier).escapedText == "LuaUserdata";
          }
          return false;
        });

        return luaUserData != undefined;
      }
    }    
  }

  return false;
}

export default function(options: PluginOptions): tstl.Plugin {
  void options;

  return {
    visitors: {
      [ts.SyntaxKind.SpreadElement]: (node, context) => {
        const type = context.checker.getTypeAtLocation(node.expression);
        if (isArrayType(context, type) && isLuaUserData(type)) {
          const innerExpression = context.transformExpression(node.expression);
          const x = tstl.createIdentifier("x");
          const self = tstl.createIdentifier("___");          
          const mapFunction = lua.createFunctionExpression(tstl.createBlock([tstl.createReturnStatement([lua.cloneIdentifier(x)])]), [self, x], undefined, tstl.FunctionExpressionFlags.Inline); 
          const map = transformLuaLibFunction(context, LuaLibFeature.ArrayMap, node, innerExpression, ...[mapFunction]);
          return createUnpackCall(context, map, node);
        }

        return context.superTransformExpression(node);
      },
    },
  };
}
