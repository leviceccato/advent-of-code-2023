const input = await Bun.file('input.txt').text()

class Grid {
	tiles: string[]
	width: number
	start: number

	constructor(rawGrid: string) {
		const tiles = rawGrid.split('')

		this.tiles = tiles
		this.width = 1 + tiles.findIndex((tile) => tile === '\n')
		this.start = tiles.findIndex((tile) => tile === 'S')
	}

	getAdjoiningTileIndexes(index: number): number[] {
		const top = index - this.width
		const bottom = index + this.width
		const left = index - 1
		const right = index + 1

		switch (this.tiles[index]) {
			case '|':
				return [top, bottom]
			case '-':
				return [left, right]
			case 'L':
				return [top, right]
			case 'J':
				return [left, top]
			case '7':
				return [left, bottom]
			case 'F':
				return [right, bottom]
			// Assume 'S'
			default:
				const adjoiningIndexes: number[] = []
				;[top, right, bottom, left].forEach((adjacentIndex) => {
					if (this.getAdjoiningTileIndexes(adjacentIndex).includes(index)) {
						adjoiningIndexes.push(adjacentIndex)
					}
				})
				return adjoiningIndexes
		}
	}

	get loop(): number[] {
		const indexes = [this.start]

		while (this.tiles[indexes[0]] !== 'S' || indexes.length === 1) {
			const adjoiningIndexes = this.getAdjoiningTileIndexes(indexes[0])
			adjoiningIndexes.forEach((index) => {
				if (index !== indexes[0]) {
					indexes.unshift(index)
					console.log(index)
				}
			})
		}

		return indexes
	}
}

console.log(new Grid(input).loop)
