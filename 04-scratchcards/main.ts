const input = await Bun.file('input.txt').text()

const cards = input.split('\n').map(parseCard)

const pointCount = cards
	.map(getWinCount)
	.map(getPointCount)
	.reduce((sum, c) => sum + c, 0)

console.log(`Total points: ${pointCount}`)

const cardCounts = cards.map(() => 1)

cards.forEach((card, cardIndex) => {
	let index = cardIndex + 1
	const endIndex = index + getWinCount(card)
	while (index < endIndex) {
		cardCounts[index] += cardCounts[cardIndex]
		index++
	}
})

const cardCount = cardCounts.reduce((sum, c) => sum + c, 0)

console.log(`Total scratchcards: ${cardCount}`)

type Card = {
	winning: number[]
	drawn: number[]
}

function parseCard(rawCard: string): Card {
	const [rawWinning, rawDrawn] = rawCard.split(': ').at(-1)?.split(' | ') || []
	return {
		winning: parseNums(rawWinning),
		drawn: parseNums(rawDrawn),
	}
}

function parseNums(rawNums: string): number[] {
	return rawNums.replaceAll('  ', ' ').split(' ').filter(Boolean).map(Number)
}

function getWinCount(card: Card): number {
	return Array.from(card.drawn).filter((num) => card.winning.includes(num))
		.length
}

function getPointCount(winCount: number): number {
	return winCount < 2 ? winCount : Math.pow(2, winCount - 1)
}
