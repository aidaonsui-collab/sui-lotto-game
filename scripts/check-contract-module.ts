// Script to verify the actual module name of the deployed contract
import { SuiClient } from "@mysten/sui/client"

const PACKAGE_ID =
  process.env.NEXT_PUBLIC_PACKAGE_ID || "0x576102e25b27195ee4e3ad18da30e840f2390cfe2ace04554d0a3418311af464"

async function checkContractModule() {
  console.log("==========================================")
  console.log("CHECKING DEPLOYED CONTRACT MODULE NAME")
  console.log("==========================================")
  console.log("")

  const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io:443" })

  try {
    console.log("Fetching package:", PACKAGE_ID)
    console.log("")

    const packageObj = await client.getObject({
      id: PACKAGE_ID,
      options: {
        showContent: true,
      },
    })

    console.log("Package object retrieved successfully!")
    console.log("")
    console.log("Content:", JSON.stringify(packageObj, null, 2))
    console.log("")

    // Try to get normalized modules
    console.log("Attempting to get normalized modules...")
    const modules = await client.getNormalizedMoveModulesByPackage({ package: PACKAGE_ID })

    console.log("")
    console.log("==========================================")
    console.log("AVAILABLE MODULES:")
    console.log("==========================================")

    const moduleNames = Object.keys(modules)
    moduleNames.forEach((moduleName, index) => {
      console.log(`${index + 1}. ${moduleName}`)

      const module = modules[moduleName]
      console.log("   Exposed functions:")

      Object.keys(module.exposedFunctions || {}).forEach((funcName) => {
        console.log(`   - ${funcName}`)
      })
      console.log("")
    })

    console.log("==========================================")
    console.log("RESULT:")
    console.log("==========================================")

    if (moduleNames.includes("lotto_game")) {
      console.log('✅ Module "lotto_game" EXISTS')
      console.log("   Use: NEXT_PUBLIC_MODULE_NAME=lotto_game")
    } else {
      console.log('❌ Module "lotto_game" NOT FOUND')
    }

    if (moduleNames.includes("playground")) {
      console.log('✅ Module "playground" EXISTS')
      console.log("   Use: NEXT_PUBLIC_MODULE_NAME=playground")
    } else {
      console.log('❌ Module "playground" NOT FOUND')
    }

    console.log("")
    console.log("==========================================")
  } catch (error) {
    console.error("Error fetching contract:", error)
    console.log("")
    console.log("This could mean:")
    console.log("1. The PACKAGE_ID is incorrect")
    console.log("2. The contract is not deployed on mainnet")
    console.log("3. Network connection issue")
  }
}

checkContractModule()
