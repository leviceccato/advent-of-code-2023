const input = await Bun.file('input.txt').text()

const [rawTimes, rawDistances] = input
	.split('\n')
	.map((l) => l.match(/\d+/g)?.map(String) || [])

const pressDurationProduct = rawTimes
	.map(Number)
	.reduce((result, time, index) => {
		return result * getPressDurationCount(time, Number(rawDistances[index]))
	}, 1)

const pressDurations = getPressDurationCount(
	Number(rawTimes.join('')),
	Number(rawDistances.join('')),
)

console.log(`Product of possible button press durations: ${pressDurationProduct}
Possible button press durations: ${pressDurations}`)

function getPressDurationCount(time: number, distance: number): number {
	const squareRoot = Math.sqrt(Math.pow(time, 2) - 4 * distance)
	const root1 = (-time + squareRoot) / -2
	const root2 = (-time - squareRoot) / -2
	return Math.ceil(root2) - Math.floor(root1) - 1
}
