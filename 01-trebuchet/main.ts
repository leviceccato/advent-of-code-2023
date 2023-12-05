const input = await Bun.file('input.txt').text()

const calibrationSum = inputToCalibrationSum(input)

const adjustedInput = input
	.replaceAll('one', 'o1e')
	.replaceAll('two', 't2o')
	.replaceAll('three', 't3e')
	.replaceAll('four', 'f4r')
	.replaceAll('five', 'f5e')
	.replaceAll('six', 's6x')
	.replaceAll('seven', 's7n')
	.replaceAll('eight', 'e8t')
	.replaceAll('nine', 'n9e')

const calibrationSum2 = inputToCalibrationSum(adjustedInput)

console.log(`Sum of calibration values: ${calibrationSum}
Adjusted sum of calibration values: ${calibrationSum2}`)

function inputToCalibrationSum(input: string): number {
	return input
		.split('\n')
		.map((line) => lineToNumber(line))
		.reduce((sum, number) => sum + number, 0)
}

function lineToNumber(line: string): number {
	let startIndex = 0
	let endIndex = -1
	while (Number.isNaN(Number(line[startIndex]))) {
		startIndex++
	}
	while (Number.isNaN(Number(line.at(endIndex)))) {
		endIndex--
	}
	return Number(line[startIndex] + line.at(endIndex))
}
