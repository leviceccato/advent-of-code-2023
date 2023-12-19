const input = await Bun.file('input.txt').text()

const sequences = input
	.split('\n')
	.map((rawSequence) => rawSequence.split(' ').map(Number))

const nextStepSum = sequences.reduce((sum, sequence) => {
	return sum + predictNextStep(sequence)
}, 0)

console.log(`Sum of next steps: ${nextStepSum}`)

function sequenceDifferences(steps: number[]): number[] {
	const differences: number[] = []
	for (let stepIndex = 0; stepIndex < steps.length - 1; stepIndex++) {
		differences.push(steps[stepIndex + 1] - steps[stepIndex])
	}
	return differences
}

function predictNextStep(steps: number[]): number {
	const sequences = [steps]
	while (true) {
		const sequence = sequenceDifferences(sequences[0])
		if (sequences[0].every((step) => step === 0)) {
			break
		}
		sequences.unshift(sequence)
	}
	return sequences.reduce((previous, sequence) => {
		const lastStep = sequence[sequence.length - 1]
		return previous + lastStep
	}, 0)
}
