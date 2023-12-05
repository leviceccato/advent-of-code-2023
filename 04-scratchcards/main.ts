const input = await Bun.file('input.txt').text()

const winCounts = input.split('\n').map(parseWinCount)

const pointCount = winCounts
	.map((c) => (c < 2 ? c : Math.pow(2, c - 1)))
	.reduce((sum, c) => sum + c, 0)

const cardCounts = winCounts.map(() => 1)

winCounts.forEach((winCount, cardIndex) => {
	let index = cardIndex + 1
	const endIndex = index + winCount
	while (index < endIndex) {
		cardCounts[index] += cardCounts[cardIndex]
		index++
	}
})

const cardCount = cardCounts.reduce((sum, c) => sum + c, 0)

console.log(`Total points: ${pointCount}
Total scratchcards: ${cardCount}`)

function parseWinCount(rawCard: string): number {
	const [winning, drawn] = rawCard.split(': ').at(-1)?.split(' | ') || []
	return parseNums(drawn).filter((n) => parseNums(winning).includes(n)).length
}

function parseNums(rawNums: string): number[] {
	return rawNums.replaceAll('  ', ' ').split(' ').filter(Boolean).map(Number)
}
