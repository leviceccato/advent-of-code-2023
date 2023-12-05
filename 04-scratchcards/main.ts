const input = await Bun.file('input.txt').text()

const cards = input.split('\n').map(parseCard)

const pointCount = cards
	.map(getWinCount)
	.map(getPointCount)
	.reduce((sum, c) => sum + c, 0)

console.log(`Total points: ${pointCount}`)

const cardCounts = cards.map(() => 1)

cards.forEach((card) => {
	const startIndex = card.number + 1
	const winningCards = cards.slice(startIndex, startIndex + getWinCount(card))
	const count = cardCounts.at(card.number) || 0
	const newCards = Array.from({ length: count }).flatMap(() => winningCards)
	newCards.forEach((newCard) => cardCounts[newCard.number]++)
})

const cardCount = cardCounts.reduce((sum, c) => sum + c, 0)

console.log(`Total scratchcards: ${cardCount}`)

type Card = {
	number: number
	winningNums: Set<number>
	drawnNums: Set<number>
}

function parseCard(rawCard: string, number: number): Card {
	const [rawWinningNums, rawDrawnNums] =
		rawCard.split(': ').at(-1)?.split(' | ') || []
	return {
		number,
		winningNums: parseNums(rawWinningNums),
		drawnNums: parseNums(rawDrawnNums),
	}
}

function parseNums(rawNums: string): Set<number> {
	const nums = rawNums
		.replaceAll('  ', ' ')
		.split(' ')
		.filter(Boolean)
		.map(Number)
	return new Set(nums)
}

function getWinCount(card: Card): number {
	return Array.from(card.drawnNums).filter((num) => card.winningNums.has(num))
		.length
}

function getPointCount(winCount: number): number {
	return winCount < 2 ? winCount : Math.pow(2, winCount - 1)
}
