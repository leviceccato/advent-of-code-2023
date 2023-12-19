const input = await Bun.file('input.txt').text()

const differenceGroups = input
	.split('\n')
	.map((rawSequence) => rawSequence.split(' ').map(Number))
	.map(reduceDifferences)

const nextStepSum = differenceGroups.reduce(
	(sum, differences) => sum + predictNextStep(differences),
	0,
)

const previousStepSum = differenceGroups.reduce(
	(sum, differences) => sum + predictPreviousStep(differences),
	0,
)

console.log(`Sum of next steps: ${nextStepSum}
Sum of previous steps: ${previousStepSum}`)

function sequenceDifferences(steps: number[]): number[] {
	const differences: number[] = []
	for (let stepIndex = 0; stepIndex < steps.length - 1; stepIndex++) {
		differences.push(steps[stepIndex + 1] - steps[stepIndex])
	}
	return differences
}

function reduceDifferences(steps: number[]): number[][] {
	const sequences = [steps]
	while (true) {
		const sequence = sequenceDifferences(sequences[0])
		if (sequence.every((step) => step === 0)) {
			break
		}
		sequences.unshift(sequence)
	}
	return sequences
}

function predictNextStep(differences: number[][]): number {
	return differences.reduce((previous, sequence) => {
		const lastStep = sequence[sequence.length - 1]
		return lastStep + previous
	}, 0)
}

function predictPreviousStep(differences: number[][]): number {
	return differences.reduce((previous, sequence) => {
		const lastStep = sequence[0]
		return lastStep - previous
	}, 0)
}
