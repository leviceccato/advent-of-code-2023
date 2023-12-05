const input = await Bun.file('input.txt').text()

const games = input.split('\n').map((l, i) => parseGame(l, i + 1))

const sumOfPossibleGameNumbers = games
	.filter(
		(g) => g.colors.red <= 12 && g.colors.green <= 13 && g.colors.blue <= 14,
	)
	.map((g) => g.number)
	.reduce((sum, c) => sum + c, 0)

const sumOfPossibleGamePowers = games
	.map((g) => g.colors.red * g.colors.green * g.colors.blue)
	.reduce((sum, c) => sum + c, 0)

console.log(`Sum of possible game numbers: ${sumOfPossibleGameNumbers}
Sum of possible game powers: ${sumOfPossibleGamePowers}`)

type Colors = Record<string, number>

type Game = {
	number: number
	colors: Colors
}

function parseGame(rawGame: string, number: number): Game {
	let colors: Colors = {
		red: 0,
		blue: 0,
		green: 0,
	}
	rawGame
		.split(': ')
		.at(-1)
		?.replaceAll(';', ',')
		.split(', ')
		.map((c) => c.split(' '))
		.forEach(([rawCount, name]) => {
			colors[name] = Math.max(colors[name], Number(rawCount))
		})
	return {
		number,
		colors,
	}
}
