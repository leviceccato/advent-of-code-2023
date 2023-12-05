const input = await Bun.file('input.txt').text()

const chars = input.split('').map(parseChar)

const gridWidth = chars.findIndex((c) => c.type === 'newline') + 1

{
	const symbols = chars.filter((c) => c.type === 'symbol' || c.type === 'gear')

	const allNumbers = symbols
		.map((symbol) => getSurroundingNumbers(symbol.index, gridWidth, chars))
		.map((numbers) => numbers.map((n) => expandNumber(n, chars)))
		.reduce((allNumbers, numbers) => allNumbers.concat(numbers), [])

	const numberMap = new Map(
		allNumbers.map((number) => [number.index, Number(number.value)]),
	)

	const partNumberSum = Array.from(numberMap.values()).reduce(
		(sum, num) => sum + num,
		0,
	)

	console.log(`Sum of part numbers: ${partNumberSum}`)
}

{
	const gearSymbols = chars.filter((c) => c.type === 'gear')

	const gearRatioSum = gearSymbols
		.flatMap((symbol) => {
			const surroundingNumbers = getSurroundingNumbers(
				symbol.index,
				gridWidth,
				chars,
			)

			const numbers = surroundingNumbers.map((n) => expandNumber(n, chars))
			const uniqueNumbers = numbers.reduce<{
				indexes: Set<number>
				numbers: CharNumber[]
			}>(
				(state, number) => {
					if (state.indexes.has(number.index)) {
						return state
					}
					state.indexes.add(number.index)
					state.numbers.push(number)
					return state
				},
				{
					indexes: new Set(),
					numbers: [],
				},
			)
			if (uniqueNumbers.numbers.length !== 2) {
				return []
			}
			return [
				Number(uniqueNumbers.numbers[0].value) *
					Number(uniqueNumbers.numbers[1].value),
			]
		})
		.reduce((sum, ratio) => sum + ratio, 0)

	console.log(`Sum of gear ratios: ${gearRatioSum}`)
}

type Char = CharNumber | CharBlank | CharSymbol | CharGear | CharNewLine

type CharShared = {
	index: number
	value: string
}

type CharNumber = CharShared & { type: 'number' }
type CharBlank = CharShared & { type: 'blank' }
type CharSymbol = CharShared & { type: 'symbol' }
type CharGear = CharShared & { type: 'gear' }
type CharNewLine = CharShared & { type: 'newline' }

function parseChar(rawChar: string, index: number): Char {
	let type: Char['type'] = 'symbol'
	if (rawChar === '.') {
		type = 'blank'
	} else if (rawChar === '\n') {
		type = 'newline'
	} else if (rawChar === '*') {
		type = 'gear'
	} else if (!Number.isNaN(+rawChar)) {
		type = 'number'
	}
	return {
		index,
		value: rawChar,
		type,
	}
}

function expandNumber(number: CharNumber, chars: Char[]): CharNumber {
	let startIndex = number.index
	let endIndex = number.index
	while (chars[startIndex - 1]?.type === 'number') {
		startIndex--
	}
	while (chars[endIndex + 1]?.type === 'number') {
		endIndex++
	}
	const value = chars
		.slice(startIndex, endIndex + 1)
		.reduce((value, char) => value + char.value, '')
	return {
		index: startIndex,
		value,
		type: 'number',
	}
}

function getSurroundingNumbers(
	index: number,
	gridWidth: number,
	chars: Char[],
): CharNumber[] {
	const top = index - gridWidth
	const bottom = index + gridWidth
	return [
		top - 1,
		top,
		top + 1,
		index - 1,
		index + 1,
		bottom - 1,
		bottom,
		bottom + 1,
	]
		.map((i) => chars[i])
		.filter((c) => c.type === 'number') as CharNumber[]
}
