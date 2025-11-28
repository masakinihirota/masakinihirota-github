import { render, screen } from "@testing-library/react"
/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest"

import { RootAccountsDashboard } from "./root-accounts-dashboard"

describe("RootAccountsDashboard", () => {
	it("ヘッダータイトルが表示される", () => {
		render(<RootAccountsDashboard />)
		expect(screen.getByText("ルートアカウント管理")).toBeInTheDocument()
	})
})
