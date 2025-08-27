const url = "http://localhost:1234"

function generateDeeplinks() {
  const cursor = generateCursorDeeplink()
  const vscode = generateVSCodeDeeplink()

  console.log({
    cursor,
    vscode
  })
}

function generateCursorDeeplink() {
  const base64 = Buffer.from(JSON.stringify({
    url
  })).toString("base64")

  const deeplink = `cursor://anysphere.cursor-deeplink/mcp/install?name=appwrite-docs-mcp&config=${base64}`
  return deeplink
}

function generateVSCodeDeeplink() {
  const deeplink = `vscode:mcp/install?${encodeURIComponent(JSON.stringify({
    name: "appwrite-docs-mcp",
    url,
  }))}`

  return deeplink
}

generateDeeplinks()