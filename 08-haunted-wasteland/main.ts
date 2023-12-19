const input = await Bun.file('input.txt').text()

const [instructions, rawNetwork] = input.split('\n\n')

const network = parseNetwork(rawNetwork)

const stepCount1 = getStepCount(
	'AAA',
	instructions,
	network,
	(nodeName) => nodeName !== 'ZZZ',
)

const stepCounts: number[] = []
for (const [nodeName] of network) {
	if (!nodeName.endsWith('A')) {
		continue
	}
	stepCounts.push(
		getStepCount(
			nodeName,
			instructions,
			network,
			(nodeName) => !nodeName.endsWith('Z'),
		),
	)
}
const stepCount2 = leastCommonMultiple(stepCounts)

console.log(`Total steps required: ${stepCount1}
Total steps required adjusted: ${stepCount2}`)

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

function getStepCount(
	nodeName: string,
	instructions: string,
	network: Network,
	whileFunc: (n: string) => boolean,
): number {
	let stepCount = 0
	while (whileFunc(nodeName)) {
		const currentNode = network.get(nodeName)
		if (currentNode === undefined) {
			break
		}
		const instruction = instructions[stepCount % instructions.length]
		if (instruction === 'L') {
			nodeName = currentNode.left
		} else if (instruction === 'R') {
			nodeName = currentNode.right
		}
		stepCount++
	}
	return stepCount
}

function greatestCommonDivisor(number1: number, number2: number): number {
	if (!number2) {
		return number1
	}
	return greatestCommonDivisor(number2, number1 % number2)
}

function leastCommonMultiple(numbers: number[]): number {
	return numbers.reduce(
		(previousNumber, number) =>
			(previousNumber * number) / greatestCommonDivisor(previousNumber, number),
	)
}
