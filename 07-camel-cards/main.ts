const input = await Bun.file('input.txt').text()

const cardStrengthMap1 = new Map([
	['A', 14],
	['K', 13],
	['Q', 12],
	['J', 11],
	['T', 10],
])

const bets1 = input.split('\n').map((l) => parseBet(l, cardStrengthMap1, null))

const winnings1 = betsToWinnings(bets1)

const cardStrengthMap2 = new Map(cardStrengthMap1)
cardStrengthMap2.set('J', 1)

const bets2 = input.split('\n').map((l) => parseBet(l, cardStrengthMap2, 1))

const winnings2 = betsToWinnings(bets2)

console.log(`Winnings: ${winnings1}
Winnings adjusted: ${winnings2}`)

type Bet = {
	bid: number
	strength: number
	cards: number[]
}

function parseBet(
	rawBet: string,
	cardStrengthMap: Map<string, number>,
	wildcard: number | null,
): Bet {
	const [rawHand, rawBid] = rawBet.split(' ')

	const cards = rawHand
		.split('')
		.map((c) => cardStrengthMap.get(c) ?? Number(c))
	const bet = {
		bid: Number(rawBid),
		strength: 1,
		cards,
	}

	const cardToCount = new Map(cards.map((c) => [c, 0]))
	cards.forEach((card) => {
		const count = cardToCount.get(card)
		if (count !== undefined) {
			cardToCount.set(card, count + 1)
		}
	})

	const counts = [...cardToCount.values()]
	const countsIncludes2 = counts.includes(2)
	const countsIncludes3 = counts.includes(3)

	if (counts.includes(5)) {
		bet.strength = 7
	} else if (counts.includes(4)) {
		bet.strength = 6
	} else if (countsIncludes3 && countsIncludes2) {
		bet.strength = 5
	} else if (countsIncludes3) {
		bet.strength = 4
	} else if (counts.filter((c) => c === 2).length === 2) {
		bet.strength = 3
	} else if (countsIncludes2) {
		bet.strength = 2
	}

	if (wildcard === null) {
		return bet
	}

	const wildcardCount = cards.filter((c) => c === wildcard).length

	if (
		(bet.strength === 6 && (wildcardCount === 1 || wildcardCount === 4)) ||
		(bet.strength === 5 && (wildcardCount === 2 || wildcardCount === 3))
	) {
		bet.strength = 7
	} else if (
		(bet.strength === 4 && (wildcardCount === 1 || wildcardCount === 3)) ||
		(bet.strength === 3 && wildcardCount === 2)
	) {
		bet.strength = 6
	} else if (bet.strength === 3 && wildcardCount === 1) {
		bet.strength = 5
	} else if (
		bet.strength === 2 &&
		(wildcardCount === 1 || wildcardCount === 2)
	) {
		bet.strength = 4
	} else if (bet.strength === 1 && wildcardCount === 1) {
		bet.strength = 2
	}

	return bet
}

function betsToWinnings(unsortedBets: Bet[]): number {
	const bets = structuredClone(unsortedBets)
	bets.sort((bet1, bet2) => {
		let order = bet1.strength - bet2.strength
		let cardIndex = 0
		while (order === 0) {
			const card1 = bet1.cards[cardIndex]
			const card2 = bet2.cards[cardIndex]
			order = card1 - card2
			cardIndex++
		}
		return order
	})

	return bets
		.map((bet, betIndex) => bet.bid * (betIndex + 1))
		.reduce((s, w) => s + w, 0)
}
