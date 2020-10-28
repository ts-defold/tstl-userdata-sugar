import * as tstl from "typescript-to-lua";
import path from "path";
import { readFileSync } from "fs";

it("spreads userdata array", async () => {
	const result = tstl.transpileProject(path.join(__dirname, "tests.tsconfig.json"));
	expect(result.diagnostics).toHaveLength(0);

	const lua = readFileSync(path.join(__dirname, "out", "tests", "test.lua"), "utf-8");
    expect(lua).toMatchSnapshot();
});
