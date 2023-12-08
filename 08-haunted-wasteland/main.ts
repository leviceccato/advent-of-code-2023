const input = await Bun.file('input.txt').text()

const [instructions, rawNetwork] = input.split('\n\n')

const network = parseNetwork(rawNetwork)

let currentNodeName = 'AAA'
let stepCount = 0
while (currentNodeName !== 'ZZZ') {
	const currentNode = network.get(currentNodeName)
	if (currentNode === undefined) {
		break
	}
	const instruction = instructions[stepCount % instructions.length]
	if (instruction === 'L') {
		currentNodeName = currentNode.left
	} else if (instruction === 'R') {
		currentNodeName = currentNode.right
	}
	stepCount++
}

console.log(`Total steps required: ${stepCount}`)

type Network = Map<string, { left: string; right: string }>

function parseNetwork(rawNetwork: string): Network {
	const rawNodes = rawNetwork.split('\n')
	const network: Network = new Map()
	rawNodes.forEach((rawNode) => {
		const [node, left, right] = rawNode.match(/[A-Z]+/g)?.map(String) || []
		network.set(node, { left, right })
	})
	return network
}
